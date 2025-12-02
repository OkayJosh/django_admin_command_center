import argparse
from django.core.management import get_commands, load_command_class
from ..models import CommandRegistry

def discover_commands():
    commands = get_commands()
    for name, app in commands.items():
        try:
            cmd_class = load_command_class(app, name)
        except Exception:
            continue

        parser = argparse.ArgumentParser(add_help=False)
        try:
            cmd_class.add_arguments(parser)
        except Exception:
            continue

        args_data = []
        for action in parser._actions:
            if not getattr(action, "option_strings", None):
                # positional args
                field_type = "string"
            else:
                field_type = "boolean" if action.nargs == 0 and action.const is True else "string"

            args_data.append(
                {
                    "dest": action.dest,
                    "option_strings": action.option_strings,
                    "required": action.required,
                    "type": field_type,
                    "help": action.help,
                    "choices": action.choices,
                    "default": action.default,
                }
            )

        CommandRegistry.objects.update_or_create(
            name=name,
            defaults={
                "help_text": getattr(cmd_class, "help", "") or "",
                "arguments": args_data,
                "is_enabled": True,
            },
        )
