from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ..models import CommandRegistry, CommandExecution, CommandLog
from .serializers import (
    CommandSerializer,
    CommandExecutionSerializer,
    CommandLogSerializer,
)
from ..tasks import run_execution_task

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class CommandListView(generics.ListAPIView):
    queryset = CommandRegistry.objects.filter(is_enabled=True).order_by("name")
    serializer_class = CommandSerializer
    permission_classes = [IsStaff]

class CommandDetailView(generics.RetrieveAPIView):
    queryset = CommandRegistry.objects.filter(is_enabled=True)
    serializer_class = CommandSerializer
    lookup_field = "name"
    permission_classes = [IsStaff]

class CommandExecutionListCreateView(generics.ListCreateAPIView):
    serializer_class = CommandExecutionSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        return CommandExecution.objects.select_related("command").order_by("-created_at")[:100]

    def perform_create(self, serializer):
        execution = serializer.save()
        run_execution_task.delay(execution.id)
        return execution

class CommandExecutionDetailView(generics.RetrieveAPIView):
    queryset = CommandExecution.objects.select_related("command")
    serializer_class = CommandExecutionSerializer
    permission_classes = [IsStaff]

class CommandExecutionStatusView(APIView):
    permission_classes = [IsStaff]

    def get(self, request, pk):
        exe = CommandExecution.objects.get(pk=pk)
        return Response({"id": exe.id, "status": exe.status, "finished_at": exe.finished_at})

class CommandExecutionLogsView(generics.ListAPIView):
    serializer_class = CommandLogSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        execution_id = self.kwargs["pk"]
        return CommandLog.objects.filter(execution_id=execution_id).order_by("timestamp", "id")
