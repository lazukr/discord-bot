import { ChooseCommand } from "./generic/ChooseCommand";
import { NovaSigCommand } from "./novaro/NovaSigCommand";
import { RegisterableCommand } from "./RegisterableCommand";

export const CommandList: RegisterableCommand[] = [
    ChooseCommand,
    NovaSigCommand,
];