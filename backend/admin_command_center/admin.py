from django.contrib import admin
from .models import CommandRegistry, CommandExecution, CommandLog

@admin.register(CommandRegistry)
class CommandRegistryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_enabled", "last_discovered")
    search_fields = ("name",)

@admin.register(CommandExecution)
class CommandExecutionAdmin(admin.ModelAdmin):
    list_display = ("id", "command", "status", "created_at", "finished_at", "requested_by")
    list_filter = ("status", "command__name")
    search_fields = ("command__name",)

@admin.register(CommandLog)
class CommandLogAdmin(admin.ModelAdmin):
    list_display = ("id", "execution", "timestamp", "level")
    list_filter = ("level", "execution__command__name")
    search_fields = ("message",)
