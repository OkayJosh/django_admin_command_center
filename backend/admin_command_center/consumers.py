from channels.generic.websocket import AsyncJsonWebsocketConsumer

class LogStreamConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.execution_id = self.scope["url_route"]["kwargs"]["execution_id"]
        self.group_name = f"exec_{self.execution_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_log(self, event):
        await self.send_json(event["message"])
