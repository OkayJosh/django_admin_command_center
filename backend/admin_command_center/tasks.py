from celery import shared_task
from .models import CommandExecution
from .infrastructure.executor import run_execution

@shared_task(name="admin_command_center.run_execution")
def run_execution_task(execution_id: int):
    execution = CommandExecution.objects.get(id=execution_id)
    run_execution(execution)
