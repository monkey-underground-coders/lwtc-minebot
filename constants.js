const { prefix } = require("./config");

const commands = [
  {
    command: "add",
    description: `$${prefix} add <username> - добавить себя на сервер minecraft`,
  },
];

const commandsInfo = commands.map((cmd) => cmd.description).join("\n");

module.exports = {
  commandsInfo,
};
