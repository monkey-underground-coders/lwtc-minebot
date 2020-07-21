const sqlite3 = require('sqlite3');

const dbUrl = process.env.DB_URL !== undefined ? process.env.DB_URL : "./sqlite.db";

const db = new sqlite3.Database(dbUrl);

const checkTables = (() => {
  const sql = 'create table if not exists user_alias (' +
    'discord_id text primary key,' +
    'alias text not null unique' +
    ')';
  db.run(sql);
})();

const getAlias = (discordId) => {
  return new Promise((resolve, reject) => {
    const sql = 'select alias from user_alias where discord_id = ?';
    db.get(sql, [discordId], (err, row) => {
      if (err) reject(err);
      resolve(row ? row.alias : null);
    });
  });
}

const checkExistingAlias = (alias) => {
  return new Promise((resolve, reject) => {
    const sql = 'select discord_id as discordId from user_alias where alias = ?';
    db.get(sql, [alias], (err, row) => {
      if (err) reject(err);
      resolve(row ? row.discordId : null);
    });
  });
}

const removeAlias = (discordId) => {
  return new Promise((resolve, reject) => {
    const sql = 'delete from user_alias where discord_id = ?';
    db.run(sql, [discordId], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

const createAlias = (discordId, alias) => {
  return new Promise((resolve, reject) => {
    const sql = 'insert into user_alias (discord_id, alias) values (?, ?)';
    db.run(sql, [discordId, alias], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

const updateAlias = (discordId, alias) => {
  return new Promise((resolve, reject) => {
    const sql = 'update user_alias set alias = ? where discord_id = ?';
    db.run(sql, [alias, discordId], (err) => {
      if (err) reject(err);
      resolve();
    });
  })
}

process.on("exit", () => {
  db.close();
});

module.exports = {
  createAlias, getAlias, updateAlias, removeAlias, checkExistingAlias
}