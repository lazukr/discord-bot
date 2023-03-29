import { ChooseCommand } from "./generic/ChooseCommand.js";
import { DadJokeCommand } from "./generic/DadJokeCommand.js";
import { ReminderCommand } from "./generic/ReminderCommand.js";
import { NovaCharCommand } from "./novaro/NovaCharCommand.js";
import { NovaSigCommand } from "./novaro/NovaSigCommand.js";
import { RegisterableCommand } from "./RegisterableCommand.js";

export const CommandList: RegisterableCommand[] = [
    ChooseCommand,
    NovaSigCommand,
    NovaCharCommand,
    DadJokeCommand,
    ReminderCommand,
];