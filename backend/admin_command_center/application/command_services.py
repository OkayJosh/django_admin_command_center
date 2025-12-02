from django.contrib.auth import get_user_model
from django.utils import timezone
from .base_service import BaseService
from ..models import CommandRegistry, CommandExecution
from ..domain.value_objects import CommandArgs

User = get_user_model()

class CommandQueryService(BaseService):
    def list_commands(self):
        commands = CommandRegistry.objects.filter(is_enabled=True).order_by("name")
        return self.ok(list(commands))

    def get_command(self, name: str):
        try:
            cmd = CommandRegistry.objects.get(name=name, is_enabled=True)
            return self.ok(cmd)
        except CommandRegistry.DoesNotExist:
            return self.fail("Command not found")

class CommandExecutionService(BaseService):
    def create_execution(self, command: CommandRegistry, args: dict, user: User | None):
        exe = CommandExecution.objects.create(
            command=command,
            args=args,
            status="pending",
            requested_by=user,
        )
        return self.ok(exe)

    def mark_running(self, execution: CommandExecution):
        execution.status = "running"
        execution.save(update_fields=["status"])
        return execution

    def mark_finished(self, execution: CommandExecution, success: bool):
        execution.status = "success" if success else "failed"
        execution.finished_at = timezone.now()
        execution.save(update_fields=["status", "finished_at"])
        return execution

    def build_cli_args(self, execution: CommandExecution) -> list[str]:
        cmd_args = CommandArgs(execution.args)
        return cmd_args.to_cli_args()
