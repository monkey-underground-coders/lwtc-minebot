const Rcon = require("modern-rcon");
const database = require("./database");
const rcon = new Rcon(process.env.RCON_HOST, process.env.RCON_PASS);
const config = require("./config");

const getRole = (guild) => {
  return guild.roles.fetch()
    .then(roles => {
      let role = roles.cache.find((role) => role.name === config.role);
      if (!role) {
        return guild.roles.create({
          data: {
            name: config.role,
            color: "GREEN",
          },
          reason: "Create role for minecraft players"
        })
      } else {
        return role;
      }
    })
    .catch(console.error);
};

const appendRole = async (member, guild) => {
  if (config.role) {
    const role = await getRole(guild);
    if (role) member.roles.add(role);
  }
};

module.exports = {
  add: async (message, alias) => {
    if (!/^[0-9a-zA-Z]{3,20}$/.test(alias)) {
      message.channel.send('Некорректный аргумент: от 3 до 20 символов a-z, A-Z и/или 0-9');
    } else if (await database.checkExistingAlias(alias)) {
      message.channel.send('Пользователь с таким именем уже был добавлен');
    } else {
      const discordId = message.author.id;
      await appendRole(message.member, message.guild);
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
            return "";
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
