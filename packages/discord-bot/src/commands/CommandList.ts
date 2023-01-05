import { ChooseCommand } from "./generic/ChooseCommand.js";
import { NovaCharCommand } from "./novaro/NovaCharCommand.js";
import { NovaMarketCommand } from "./novaro/NovaMarketCommand.js";
import { NovaSigCommand } from "./novaro/NovaSigCommand.js";
import { RegisterableCommand } from "./RegisterableCommand.js";

export const CommandList: RegisterableCommand[] = [
    ChooseCommand,
    NovaSigCommand,
    NovaCharCommand,
    NovaMarketCommand,
];