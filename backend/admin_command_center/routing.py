from django.urls import path
from .consumers import LogStreamConsumer

websocket_urlpatterns = [
    path("ws/command-center/logs/<int:execution_id>/", LogStreamConsumer.as_asgi()),
]
