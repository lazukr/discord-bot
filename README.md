# Discord Bot

This is an updated project to play around with Discord bots built using [`Eris`](https://github.com/abalabahaha/eris). This is also to test ideas:

1. Have separate projects and utilize [`lerna`](https://github.com/lerna/lerna) to manage them. So far they are:
    - Discord Bot itself
    - Service that handles specific work that the Discord Bot should not be concerned about
1. Use [`winston`](https://github.com/winstonjs/winston) to handle logging, especially to have daily rotation log files

# Usage
1. Clone the repository
1. Run
    ```
    yarn install
    ```
1. Run
    ```
    yarn start
    ```

This should start both apps.

# Custom Commands
1. Add new commands under the commands folder:
    ```
    ./packages/discord-bot/src/commands/
    ```
    The commands themselves are grouped off of a loose classification. There is no need to create folders and put the commmand file under it.
1. Register the command in the `CommandList.ts` in the commands folder. This is the list of commands that the Discord Bot will load on startup.

**If you do not register the command, the Discord Bot will not load it.**