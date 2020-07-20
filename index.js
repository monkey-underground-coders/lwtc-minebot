require("dotenv").config();

const chalk = require("chalk");
const Discord = require("discord.js");
const config = require("./config");
const commands = require("./commands");
const { commandsInfo } = require("./constants");
const client = new Discord.Client();

const isDotenvPropertyPresented = (property) =>
  process.env.hasOwnProperty(property) && process.env[property];

const tokenPresentedInDotenv = () => {
  if (isDotenvPropertyPresented("DS_TOKEN")) return true;
  console.log(chalk.bold.red(`Discord token is not specified in dotenv`));
  return false;
};

const rconCredentialsPresentedInDotenv = () => {
  if (
    isDotenvPropertyPresented("RCON_HOST") &&
    isDotenvPropertyPresented("RCON_PASS")
  ) {
    return true;
  }
  console.log(chalk.bold.red(`RCON credentials are not presented in dotenv`));
  return false;
};

const init = (() => {
  if (!tokenPresentedInDotenv()) return;
  if (!rconCredentialsPresentedInDotenv()) return;

  client
    .on("ready", () => {
      console.log(chalk.green(`${client.user.tag} is ready!`));
    })
    .on("message", async (message) => {
      if (!message.content.startsWith(config.prefix)) return;
      if (message.author.bot) return;
      if (message.channel.type !== "text") return;

      const args = message.content.split(/\s+/g).slice(1);
      const [cmd, alias, ...rest] = args;

      if (!commands.hasOwnProperty(cmd)) {
        return message.reply(
          `Неправильная команда. Доступные команды:\n${commandsInfo}`
        );
      }

      const response = await commands[cmd](alias, rest);

      if (response.hasOwnProperty("message")) {
        message.reply(response.message);
      }
    });

  client.login(process.env.DS_TOKEN);
})();
