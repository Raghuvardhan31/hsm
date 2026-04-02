"""
ASGI config for BMS project.
"""
import os

# ⚠️ MUST be set FIRST before any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BMS.settings')

# ⚠️ MUST call this to initialize Django apps BEFORE importing app modules
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

# ✅ NOW it is safe to import app-specific modules
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import HAC.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            HAC.routing.websocket_urlpatterns
        )
    ),
})
