import { ChooseCommand } from "./generic/ChooseCommand";
import { NovaCharCommand } from "./novaro/NovaCharCommand";
import { NovaSigCommand } from "./novaro/NovaSigCommand";
import { RegisterableCommand } from "./RegisterableCommand";

export const CommandList: RegisterableCommand[] = [
    ChooseCommand,
    NovaSigCommand,
    NovaCharCommand,
];