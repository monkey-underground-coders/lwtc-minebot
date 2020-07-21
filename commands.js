const Rcon = require("modern-rcon");
const database = require("./database");
const rcon = new Rcon(process.env.RCON_HOST, process.env.RCON_PASS);

module.exports = {
  add: async (message, alias) => {
    if (!/^[0-9a-zA-Z]{3,20}$/.test(alias)) {
      message.channel.send('Некорректный аргумент: от 3 до 20 символов a-z, A-Z и/или 0-9');
    } else if (await database.checkExistingAlias(alias)) {
      message.channel.send('Пользователь с таким именем уже был добавлен');
    } else {
      const discordId = message.author.id;
      const prevAlias = await database.getAlias(discordId);
      if (prevAlias) {
        message.channel.send(`Удаляю предыдущий никнейм ${prevAlias}`);
      }
      await rcon
        .connect()
        .then(() => {
          if (prevAlias) {
            return rcon.send(`easywl remove ${prevAlias}`);
          } else {
            return new Promise(() => "");
          }
        })
        .then(() => {
          return rcon.send(`easywl add ${alias}`)
        })
        .then((res) => {
          rcon.disconnect();
          return res;
        });
      if (prevAlias) {
        await database.updateAlias(discordId, alias);
      } else {
        await database.createAlias(discordId, alias);
      }
      message.channel.send(`Успешно добавлено! Теперь Вы можете зайти на сервер с никнеймом ${alias}`);
    }
  },
};
