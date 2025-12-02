import subprocess
import sys
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils import timezone
from django.conf import settings
from ..models import CommandLog
from ..application.command_services import CommandExecutionService

def _notify_ws(execution_id: int, message: str):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return
    group_name = f"exec_{execution_id}"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {"type": "send_log", "message": {"message": message}},
    )

def run_execution(execution):
    service = CommandExecutionService()
    service.mark_running(execution)

    base_cmd = [sys.executable, "manage.py", execution.command.name]
    cli_args = service.build_cli_args(execution)
    cmd = base_cmd + cli_args

    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=str(settings.BASE_DIR),
    )

    for line in iter(process.stdout.readline, b""):
        if not line:
            break
        text = line.decode(errors="replace").rstrip()
        log = CommandLog.objects.create(execution=execution, message=text)
        _notify_ws(execution.id, text)

    code = process.wait()
    service.mark_finished(execution, success=(code == 0))
    _notify_ws(execution.id, f"[exit code={code}] finished at {timezone.now().isoformat()}")
