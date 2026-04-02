import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f"[WS] New connection attempt: {self.channel_name}")
        
        # Join the shared admin notifications group
        await self.channel_layer.group_add(
            "admin_notifications",
            self.channel_name
        )
        await self.accept()
        print(f"[WS] ✅ Connected & joined group 'admin_notifications': {self.channel_name}")
        
        # Send a confirmation message to the connected client
        await self.send(text_data=json.dumps({
            "type": "connected",
            "message": "WebSocket connected successfully"
        }))

    async def disconnect(self, close_code):
        print(f"[WS] ❌ Disconnected (code={close_code}): {self.channel_name}")
        await self.channel_layer.group_discard(
            "admin_notifications",
            self.channel_name
        )

    # Called when a message is pushed to the group via group_send
    async def send_notification(self, event):
        print(f"[WS] 📤 Sending notification to client: {event}")
        await self.send(text_data=json.dumps({
            "type": "new_registration",
            "name": event["name"],
            "message": event["message"],
            "time": event["time"],
        }))
