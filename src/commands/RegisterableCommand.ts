import Eris from "eris";
export interface RegisterableCommand {
    name: string;
    options: Eris.CommandOptions;
    command: Eris.CommandGenerator;
    subCommand?: RegisterableCommand[],
}