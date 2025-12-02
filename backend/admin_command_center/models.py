from django.db import models

class CommandRegistry(models.Model):
    name = models.CharField(max_length=200, unique=True)
    help_text = models.TextField(blank=True)
    arguments = models.JSONField(default=list)
    is_enabled = models.BooleanField(default=True)
    last_discovered = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CommandExecution(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("success", "Success"),
        ("failed", "Failed"),
    ]

    command = models.ForeignKey(CommandRegistry, on_delete=models.CASCADE, related_name="executions")
    args = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    requested_by = models.ForeignKey("auth.User", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.command.name} ({self.pk})"

class CommandLog(models.Model):
    execution = models.ForeignKey(CommandExecution, on_delete=models.CASCADE, related_name="logs")
    timestamp = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=10, default="INFO")
    message = models.TextField()

    class Meta:
        ordering = ["timestamp", "pk"]

    def __str__(self):
        return f"[{self.timestamp}] {self.message[:40]}"
