from dataclasses import dataclass
from typing import Dict, Any

@dataclass(frozen=True)
class CommandArgs:
    values: Dict[str, Any]

    def to_cli_args(self) -> list[str]:
        args = []
        for key, value in self.values.items():
            if value is None or value == "":
                continue
            if isinstance(value, bool):
                if value:
                    args.append(f"--{key}")
            else:
                args.append(f"--{key}={value}")
        return args
