# Discord Bot

This is a personal project to play around with a Discord bot.

This is also to try some ideas:
1. Use `TypeScript` instead of `JavaScript` for better readability and maintainability
1. Use [`Jest`](https://github.com/facebook/jest) to do unit tests
1. Use [`Config`](https://github.com/node-config/node-config) to handle various environment configurations
1. Use `Github Actions` to have automatic checks (must build and pass all unit tests) 
1. Use [`Eris`](https://github.com/abalabahaha/eris), mainly using [`Eris' CommandClient`](https://abal.moe/Eris/docs/0.17.1/CommandClient) feature instead of `Discord.js`.
1. Use [`winston`](https://github.com/winstonjs/winston) to handle logging, especially to have daily rotation log files

# Future Ideas
1. Have a service to read and monitor the logs
1. Add a reminder system

# Usage
1. Clone the repository
1. Run
    ```
    yarn install
    ```
1. Rename `./src/config-sample.json` to `config.json` and configure it, check the Discord Configuration section
1. Run
    ```
    yarn start
    ```
This should start the Discord bot instance.

# Discord Configuration
| config | default | notes |
| - | - | - |
| `token` | `""` | The discord bot client token. Do not ever reveal this.
| `prefix` | `!` | The symbol prefix that the bot accepts to intepret a command.
| `env` | `dev` | The environment that the applications are running in. For `dev`, it allows logging to show the console with colour codes. `prod` lacks the console with colour codes and only writes to log files.

# Custom Commands
1. Understand how to use [`Eris' Command`](https://abal.moe/Eris/docs/0.17.1/Command) class
1. Add new commands under the commands folder:
    ```
    ./src/commands/
    ```
    The commands themselves are grouped off of a loose classification. There is no need to create folders and put the commmand file under it.
1. Register the command in the `CommandList.ts` in the commands folder. This is the list of commands that the Discord Bot will load on startup.

**If you do not register the command, the Discord Bot will not load it.**
