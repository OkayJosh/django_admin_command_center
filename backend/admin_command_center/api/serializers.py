from rest_framework import serializers
from ..models import CommandRegistry, CommandExecution, CommandLog

class CommandArgumentSerializer(serializers.Serializer):
    dest = serializers.CharField()
    option_strings = serializers.ListField(child=serializers.CharField(), required=False)
    required = serializers.BooleanField()
    type = serializers.CharField()
    help = serializers.CharField(allow_blank=True, required=False)
    choices = serializers.ListField(child=serializers.CharField(), required=False, allow_null=True)
    default = serializers.CharField(allow_blank=True, required=False, allow_null=True)

class CommandSerializer(serializers.ModelSerializer):
    arguments = CommandArgumentSerializer(many=True)

    class Meta:
        model = CommandRegistry
        fields = ["id", "name", "help_text", "arguments", "is_enabled"]

class CommandExecutionSerializer(serializers.ModelSerializer):
    command = CommandSerializer(read_only=True)
    command_name = serializers.CharField(write_only=True)
    args = serializers.JSONField()

    class Meta:
        model = CommandExecution
        fields = ["id", "command", "command_name", "args", "status", "created_at", "finished_at"]

    def create(self, validated_data):
        from ..application.command_services import CommandQueryService, CommandExecutionService

        cmd_name = validated_data.pop("command_name")
        args = validated_data.pop("args", {})
        request = self.context.get("request")

        query_service = CommandQueryService()
        result = query_service.get_command(cmd_name)
        if not result.success:
            raise serializers.ValidationError({"command_name": "Command not found"})
        command = result.data

        exe_service = CommandExecutionService()
        result = exe_service.create_execution(command, args, user=getattr(request, "user", None))
        return result.data

class CommandLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandLog
        fields = ["id", "timestamp", "level", "message"]
