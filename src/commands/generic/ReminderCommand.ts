import { TextChannel } from "eris";
import Cronstrue from "cronstrue";
import { config } from "../../configuration/Config.js";
import { BotLogger } from "../../BotLogger.js";
import { ScheduleComponents, Scheduler, WHEN_TYPE } from "../../Scheduler.js";
import { RegisterableCommand } from "../RegisterableCommand.js";


const COMMAND_NAME = "reminder";
const USER_TZ = config.usertz;

const IN_REGEX = /\sin(?!.+\sin)\s.+/;
const AT_REGEX = /\sat(?!.+\sat)\s.+/;
const CRON_REGEX = /\scron(?!.+\scron)\s.+/;

const MAX_FIELDS = 25;


export enum DELETE_TYPE {
    INDEX,
    ID,
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
    const cronMatch = sentence.match(CRON_REGEX);

    // no matches
    if (inMatch === null && atMatch === null && cronMatch === null) {
        return {
            success: false,
            when: "",
            message: "",
            type: WHEN_TYPE.NEITHER,
        };
    }

    const sortedMatch = [
        {
            matcher: inMatch,
            type: WHEN_TYPE.IN,
        },
        {
            matcher: atMatch,
            type: WHEN_TYPE.AT,
        },
        {
            matcher: cronMatch,
            type: WHEN_TYPE.CRON,
        }]
        .filter(m => m.matcher !== null)
        .sort((a, b) => (b.matcher?.index ?? 0) - (a.matcher?.index ?? 0));

    const {
        matcher,
        type,
    } = sortedMatch[0];

    return {
        success: true,
        when: matcher![0].trim(),
        message: matcher!.input!.substring(0, matcher!.index).trim(),
        type: type,
    };
};

export const tryParseDeleteInput = (args: string): ParseDeleteResult => {
    const index = Number(args);
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
            return "Need to provide a message an `at` clause, `in` clause or `cron` clause.";
        }

        const list = await Scheduler.list(msg.author.id);

        if (list.length >= MAX_FIELDS) {
            return `Please don't queue more than ${MAX_FIELDS} reminders.`;
        }

        const {
            success,
            when,
            message,
            type,
        } = tryParseQueueInput(args);

        if (success === false) {
            BotLogger.warn(`Could not parse queue input. Original message: ${args.join(" ")}`);
            return "Need to provide a message an `at` clause, `in` clause or `cron` clause.";
        }

        var {
            job,
            failReason,
        } = await Scheduler.schedule(when, {
            message: message,
            userid: msg.author.id,
            username: msg.author.username,
            channelid: msg.channel.id,
            queuedAt: Date.now(),
            channelname: (msg.channel as TextChannel).name,
            type: type,
        }, {
            timezone: USER_TZ[msg.author.id],
            whenType: type,
        });

        if (failReason !== undefined) {
            return failReason;
        }

        if (type === WHEN_TYPE.CRON) {
            return `Scheduled message \`${message}\` ${Cronstrue.toString(job.attrs.repeatInterval as string, {verbose: true}).toLocaleLowerCase()}`;
        }

        const sec = Math.floor(job.attrs.nextRunAt!.getTime() / 1000);
        return `Scheduled message \`${message}\` at <t:${sec}:f>`;
    },
    options: {
        description: "Queues a reminder.",
        fullDescription: "Queues a reminder. Requires you to include one of the following clauses: \n\
- `at` for specific time. e.g.: x at 5 pm. \n\
- `in` for relative time. e.g.: x in 5 hours. \n\
- `cron` for recurring time. e.g.: x cron `0 5 * * *`. (backticks are optional but useful if using \\*) \n\
for reference, here is the cron parameters: \n\
```\
*    *    *    *    *    * \n\
┬    ┬    ┬    ┬    ┬    ┬ \n\
│    │    │    │    │    | \n\
│    │    │    │    │    └ day of week (0 - 7, 1L - 7L) (0 or 7 is Sun) \n\
│    │    │    │    └───── month (1 - 12) \n\
│    │    │    └────────── day of month (1 - 31, L) \n\
│    │    └─────────────── hour (0 - 23) \n\
│    └──────────────────── minute (0 - 59) \n\
└───────────────────────── second (0 - 59, optional).\
        ```\n\
        refer to <https://crontab.guru/> to find the right combination.",
        usage: "`<message> at <exact time>` or `<message> in <relative time>` or `<message> cron <cron format>`",
        aliases: ["rmb"],
        argsRequired: true,
    },
    subCommand: [
        {
            name: "--list",
            command: async (msg, args) => {
                BotLogger.log(`Command [${COMMAND_NAME} --list] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join(" ")}.`);
                const list = await Scheduler.list(msg.author.id);
                
                BotLogger.log(`Resulting list contains ${list.length} reminders.`);

                if (list.length === 0) {
                    return "You have no reminders.";
                }

                const total = list.length;

                const results = list.map((l, index) => {
                    const data = l.attrs.data as ScheduleComponents;
                    const nextRunAt = data.type === WHEN_TYPE.CRON ? 
                        `\`${l.attrs.repeatInterval}\`` : 
                        `<t:${Math.floor(l.attrs.nextRunAt!.getTime() / 1000)}:f>`;
                    return {
                        index: index + 1,
                        id: l.attrs._id!.toString(),
                        message: data.message,
                        nextRunAt: nextRunAt,
                    };
                });

                const subResults = results.slice(0, MAX_FIELDS);

                const field = {
                    name: `\`##  message ${" ".repeat(22)}  when / cron ${" ".repeat(8)}\``,
                    value: subResults.map(l => {
                        return `\`${l.index.toString().padEnd(2, " ")}  ${l.message.substring(0, 30).padEnd(30, " ")} \` ${l.nextRunAt}`;
                    }).join("\n"),
                };

                return {
                    embed: {
                        title: `${msg.author.username}'s reminders`,
                        fields: [field],
                        footer: {
                            text: `Showing from ${subResults[0].index} to ${subResults[subResults.length - 1].index} out of a total of ${total}`,
                        }
                    }
                };
            },
            options: {
                description: "Lists the reminders you have.",
                fullDescription: "Lists the reminders you have.",
                usage: "<page>",
                aliases: ["--l"],
            }
        },
        {
            name: "--delete",
            command: async (msg, args) => {
                BotLogger.log(`Command [${COMMAND_NAME} --delete] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join(" ")}.`);
                const parsed = tryParseDeleteInput(args.join(" "));
                
                if (parsed.type === DELETE_TYPE.INDEX) {
                    BotLogger.log(`Deleting reminder for ${msg.author.id}-[${msg.author.username}] with index: ${parsed.result}.`);
                    const result = await deleteByIndex(msg.author.id, parsed.result as number);
                    
                    if (result.success === false) {
                        BotLogger.error(`Failed to delete reminder for ${msg.author.id}-[${msg.author.username}] with index: ${result.idOrIndex}.`);
                        return result.message;
                    }

                    BotLogger.log(`Successfully deleted reminder for ${msg.author.id}-[${msg.author.username}] with index: ${result.idOrIndex}.`);
                    return result.message;
                }
                else {
                    return "Invalid index provided.";
                }
            },
            options: {
                description: "Removes a reminder you have queued.",
                fullDescription: "Removes a reminder you have queued by index.",
                aliases: ["--del", "--d", "--remove", "--r"],
                usage: "<index>",
                argsRequired: true,
            }
        },
        {
            name: "--clear",
            command: async (msg, args) => {
                BotLogger.log(`Command [${COMMAND_NAME} --clear] from ${msg.author.id}-[${msg.author.username}].`);
                const removedCount = await Scheduler.deleteByUserId(msg.author.id);
                BotLogger.log(`Removed ${removedCount} reminders for ${msg.author.id}-[${msg.author.username}]`);
                return `Removed ${removedCount} reminders.`;
            },
            options: {
                description: "Removes all reminders you have queued.",
                fullDescription: "Removes a reminder you have queued.",
                aliases: ["--c"],
            }
        }
    ]
};