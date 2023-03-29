import { Agenda, Job, JobWithId } from "@hokify/agenda";
import Eris from "eris";
import { ObjectId } from "mongodb";
import { BotLogger } from "./BotLogger.js";
import { ScheduleComponents } from "./commands/generic/ReminderCommand.js";
import { config } from "./configuration/Config.js";
import { DiscordBot } from "./DiscordBot.js";

export class Scheduler {
    private static agenda: Agenda;

    static init (bot: DiscordBot) {
        Scheduler.agenda = new Agenda({
            db: {
                address: config.agenda,
            }
        });
        
        Scheduler.agenda.define("send message", async job => {
            const { 
                message,
                userid,
                channelid,
            } = job.attrs.data as ScheduleComponents;
            const channel = bot.getChannel(channelid) as Eris.TextableChannel;
            await channel.createMessage(`${userid} \`${message}\``);
        });
        
        Scheduler.attachListeners();
        Scheduler.agenda.start();
    }

    private static attachListeners() {
        Scheduler.agenda.on("start", job => {
            const { 
                message,
                channelname,
                username,
            } = job.attrs.data as ScheduleComponents;
            BotLogger.log(`Job[${job.attrs._id}] starting for [${username}] on [${channelname}] with ["${message}"].`);
        });

        Scheduler.agenda.on("fail:send message", (err: Error, job: JobWithId) => {
            BotLogger.error(`Job[${job.attrs._id}] failed with "${err.message}".`);
        });

        Scheduler.agenda.on("success:send message", async job => {
            const result = await this.agenda.cancel({
                _id: job.attrs._id,
            });
            BotLogger.log(`Job[${job.attrs._id}] completed successfully and removed (${result}) from database.`);
        });
    }

    static async schedule(when: string, schedule: ScheduleComponents): Promise<Job<ScheduleComponents>> {
        return await Scheduler.agenda.schedule(when, "send message", schedule);
    }

    static async list(userid: string) {
        return await Scheduler.agenda.jobs({
            name: "send message",
            // not sure why i have to use string here
            // was expecting {data { userid: etc }}
            "data.userid": userid,
        }, {
            "data.queuedAt": 1,
        });
    }

    static isValidId(id: string) {
        return ObjectId.isValid(id);
    }

    static async getById(userid: string, id: string) {
        // return empty list if not a valid id.
        if (Scheduler.isValidId(id) === false) {
            return [];
        }

        return await Scheduler.agenda.jobs({
            name: "send message",
            "data.userid": userid,
            _id: new ObjectId(id),
        });
    }

    static async deleteById(userid: string, id: string) {
        const result = await Scheduler.agenda.cancel({
            name: "send message",
            _id: new ObjectId(id),
            "data.userid": userid,
        });

        return result > 0 ? true : false;
    }
}
