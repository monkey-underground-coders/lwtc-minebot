# lwtc-minebot

A minecraft bot that grants access to the server using RCON

## Usage

1. `$ git clone https://github.com/monkey-underground-coders/lwtc-minebot`
2. `$ cd lwtc-minebot`
3. `$ npm install`
4. Configure Discord bot and RCON credentials in .env:

```dotenv
DS_TOKEN=<your-token>
RCON_HOST=<rcon-host>
RCON_PASS=<rcon-pass>
```

Optionally:
```dotenv
DB_URL=<sqlite3-url>
```

5. `$ node index.js` to run the bot!
