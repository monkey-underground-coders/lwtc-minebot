const Rcon = require("modern-rcon");
const rcon = new Rcon(process.env.RCON_HOST, process.env.RCON_PASS);

module.exports = {
  add: async (alias) => {
    const rconResponse = await rcon
      .connect()
      .then(() => {
        return rcon.send(`easywl add ${alias}`);
      })
      .then((res) => {
        rcon.disconnect();
        return res;
      });

    return {
      message: `Успешно добавлено! Теперь Вы можете зайти на сервер с никнеймом ${alias}`,
      data: rconResponse,
    };
  },
};
