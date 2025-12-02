from django.apps import AppConfig

class AdminCommandCenterConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "admin_command_center"
    verbose_name = "Admin Command Center"

    def ready(self):
        # optional: auto-discovery on startup, keep light
        try:
            from .infrastructure.discovery import discover_commands
            discover_commands()
        except Exception:
            # Avoid crashing if DB is not ready (e.g. migrate)
            pass
