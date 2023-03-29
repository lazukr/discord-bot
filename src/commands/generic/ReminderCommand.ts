import * as Chrono from "chrono-node";
import { TextChannel } from "eris";
import { BotLogger } from "../../BotLogger.js";
import { Scheduler } from "../../Scheduler.js";
import { RegisterableCommand } from "../RegisterableCommand.js";

const COMMAND_NAME = "reminder";

const IN_REGEX = /in(?!.+\sin)\s.+/;
const AT_REGEX = /at(?!.+\sat)\s.+/;

export enum WHEN_TYPE {
    NEITHER,
    IN,
    AT,
};

export enum DELETE_TYPE {
    INDEX,
    ID,
};

export interface ScheduleComponents {
    message: string;
    channelid: string,
    channelname: string,
    userid: string,
    username: string,
    queuedAt: number,
};

interface ParseQueueResult {
    success: boolean;
    when: string;
    message: string;
    type: WHEN_TYPE;
};

interface ParseDeleteResult {
    result: string | number;
    type: DELETE_TYPE;
};

interface DeleteResponse {
    success: boolean;
    message: string;
    idOrIndex: string | number;
    data?: ScheduleComponents;
};

export const tryParseQueueInput = (args: string[]): ParseQueueResult => {
    const sentence = args.join(" ");
    
    const inMatch = sentence.match(IN_REGEX);
    const atMatch = sentence.match(AT_REGEX);

    // no matches
    if (inMatch === null && atMatch === null) {
        return {
            success: false,
            when: "",
            message: "",
            type: WHEN_TYPE.NEITHER,
        };
    }

    // in match only
    if (inMatch !== null && atMatch === null) {
        return {
            success: true,
            when: inMatch[0],
            message: inMatch.input!.substring(0, inMatch.index).trim(),
            type: WHEN_TYPE.IN,
        };
    }

    // at match only
    if (inMatch === null && atMatch !== null) {
        return {
            success: true,
            when: atMatch[0],
            message: atMatch.input!.substring(0, atMatch.index).trim(),
            type: WHEN_TYPE.AT,
        };
    }

    // both exist, need to compare to see which one is closer to the end and use that
    if (inMatch!.index! > atMatch!.index!) {
        return {
            success: true,
            when: inMatch![0],
            message: inMatch!.input!.substring(0, inMatch!.index).trim(),
            type: WHEN_TYPE.IN,
        };
    } else {
        return {
            success: true,
            when: atMatch![0],
            message: atMatch!.input!.substring(0, atMatch!.index).trim(),
            type: WHEN_TYPE.AT,
        };
    }
};

export const tryParseDeleteInput = (args: string): ParseDeleteResult => {
    const index = Number(args);
    console.log(index);
    if (isNaN(index)) {
        return {
            result: args,
            type: DELETE_TYPE.ID,
        };
    }
    return {
        result: index,
        type: DELETE_TYPE.INDEX,
    };
};

const deleteByIndex = async (userid: string, index: number): Promise<DeleteResponse> => {
    const jobs = await Scheduler.list(userid);
    if (jobs.length < index || index < 0) {
        return {
            idOrIndex: index,
            success: false,
            message: `Could not find reminder with index: \`${index}\`. You either don't have that many reminders or the number is negative.`,
        };
    }

    const job = jobs[index - 1];
    return await deleteById(userid, job.attrs._id!.toString());
};

const deleteById = async (userid: string, id: string): Promise<DeleteResponse> => {
    const jobs = await Scheduler.getById(userid, id);
    if (jobs.length === 0) {
        return {
            idOrIndex: id,
            message: `Could not find reminder with id: \`${id}\`. It's either an invalid id or it does not belong to you.`,
            success: false,
        };
    }

    const data = jobs[0].attrs.data as ScheduleComponents;
    const success = await Scheduler.deleteById(userid, id);
    if (success) {
        return {
            idOrIndex: id,
            success: true,
            message: `Successfully deleted reminder for \`${data.username}\` with id \`${id}\` that contained the message: \`${data.message}\`.`,
            data: data,
        };
    } else {
        return {
            message: `There was some issue trying to delete reminder with id: \`${id}\`.`,
            idOrIndex: id,
            success: false,
        };
    }
};

export const ReminderCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        BotLogger.log(`Command [${COMMAND_NAME}] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join(" ")}`);
        
        if (args.length === 0) {
            return "Need to provide a message with either an `at` qualifier or `in` qualifier.";
        }

        const {
            success,
            when,
            message,
            type,
        } = tryParseQueueInput(args);

        if (success === false) {
            return "Need to provide a message with either an `at` qualifier or `in` qualifier.";
        }

        var job = await Scheduler.schedule(when, {
            message: message,
            userid: msg.author.mention,
            username: msg.author.username,
            channelid: msg.channel.id,
            queuedAt: Date.now(),
            channelname: (msg.channel as TextChannel).name,
        });

        const sec = Math.floor(job.attrs.nextRunAt!.getTime() / 1000);

        // relative if relative time, else absolute
        return `Scheduled message \`${message}\` at <t:${sec}:${type === WHEN_TYPE.IN ? "R" : "f"}>`;
    },
    options: {
        description: "Queues a reminder.",
        fullDescription: "Queues a reminder. Requires you to include an `at` or `in` somewhere in the sentence for it to determine when to schedule it. Use `at` if you want a specific time. Use `in` if you want a relative time.",
        usage: "`<message> <at <exact time> | in <relative time>>`",
        aliases: ["rmb"],
        argsRequired: true,
    },
    subCommand: [
        {
            name: "--list",
            command: async (msg, args) => {
                BotLogger.log(`Command [${COMMAND_NAME} --list] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join(" ")}.`);
                const list = await Scheduler.list(msg.author.mention);
                if (list.length === 0) {
                    return "You have no reminders.";
                }

                const results = list.map(l => {
                    const data = l.attrs.data as ScheduleComponents;
                    return {
                        id: l.attrs._id,
                        message: data.message,
                        nextRunAt: l.attrs.nextRunAt,
                    };
                });

                return results.map(i => JSON.stringify(i)).join("\n");
            },
            options: {
                description: "Lists the reminders you have.",
                fullDescription: "Lists the reminders you have.",
                aliases: ["--l"],
            }
        },
        {
            name: "--delete",
            command: async (msg, args) => {
                
                BotLogger.log(`Command [${COMMAND_NAME} --delete] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join(" ")}.`);
                const parsed = tryParseDeleteInput(args.join(" "));
                
                if (parsed.type === DELETE_TYPE.ID) {
                    
                    BotLogger.log(`Deleting reminder for ${msg.author.id}-[${msg.author.username}] with id: ${parsed.result}.`);
                    const result = await deleteById(msg.author.mention, parsed.result as string);
                    
                    if (result.success === false) {
                        BotLogger.error(`Failed to delete reminder for ${msg.author.id}-[${msg.author.username}] with id: ${result.idOrIndex}.`);
                        return result.message;
                    }
                
                    BotLogger.log(`Successfully deleted reminder for ${msg.author.id}-[${msg.author.username}] with id: ${result.idOrIndex}.`);
                    return result.message;
                }
                else {
                    
                    BotLogger.log(`Deleting reminder for ${msg.author.id}-[${msg.author.username}] with index: ${parsed.result}.`);
                    const result = await deleteByIndex(msg.author.mention, parsed.result as number);
                    
                    if (result.success === false) {
                        BotLogger.error(`Failed to delete reminder for ${msg.author.id}-[${msg.author.username}] with index: ${result.idOrIndex}.`);
                        return result.message;
                    }

                    BotLogger.log(`Successfully deleted reminder for ${msg.author.id}-[${msg.author.username}] with index: ${result.idOrIndex}.`);
                    return result.message;
                }
            },
            options: {
                description: "Removes a reminder you have queued.",
                fullDescription: "Removes a reminder you have queued either by id or by index.",
                aliases: ["--del", "--d"],
                usage: "<id> / [index]",
                argsRequired: true,
            }
        },
    ]
};