export interface CommandArgument {
  dest: string;
  option_strings?: string[];
  required: boolean;
  type: string;
  help?: string;
  choices?: string[] | null;
  default?: string | null;
}

export interface Command {
  id: number;
  name: string;
  help_text?: string;
  arguments: CommandArgument[];
  is_enabled: boolean;
}
