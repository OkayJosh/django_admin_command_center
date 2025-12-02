from django.urls import path
from .views import (
    CommandListView,
    CommandDetailView,
    CommandExecutionListCreateView,
    CommandExecutionDetailView,
    CommandExecutionStatusView,
    CommandExecutionLogsView,
)

urlpatterns = [
    path("commands/", CommandListView.as_view(), name="command-list"),
    path("commands/<str:name>/", CommandDetailView.as_view(), name="command-detail"),
    path("executions/", CommandExecutionListCreateView.as_view(), name="execution-list-create"),
    path("executions/<int:pk>/", CommandExecutionDetailView.as_view(), name="execution-detail"),
    path("executions/<int:pk>/status/", CommandExecutionStatusView.as_view(), name="execution-status"),
    path("executions/<int:pk>/logs/", CommandExecutionLogsView.as_view(), name="execution-logs"),
]
