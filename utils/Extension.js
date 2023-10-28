const express = require('express');
const app = express();
const logger = require('../logger');
const path = require('path');
const axios = require('axios');

function Uptime(url) {
    switch (process.platform) {
        case 'win32': {
          logger("Your Operating System does not currently support Auto Uptime !");
          break;
        }
        case 'darwin': {
          logger("Your Operating System does not currently support Auto Uptime !");
          break;
        }
        case 'linux':
          if (process.env.REPL_SLUG) {
            logger(`Activating uptime for ${chalk.underline(`'${url}'`)}`);
            return setInterval(function () {
              axios.get(url).then(() => { }).catch(() => { });
            }, 10 * 1000);
          }
          else {
            logger("Your Operating System does not currently support Auto Uptime !");
          }
          break;
        default:
          logger("Your Operating System does not currently support Auto Uptime !");
      }
}

function CreateSiteHtml(port) {
    app.use(express.static(path.join(__dirname, "/Html")));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/Html/index.html'));
      });
      
    app.get('/', (req, res) => res.sendStatus(200));

    const listen_port = port || 3000;

    app.listen(listen_port, () => {
        logger(`Bot is running on port: ${listen_port}`);
       
    app.on('error', (error) => {
        logger(`An error occurred while starting the server: ${error}`);
      });
    });
}

module.exports = {
    CreateSiteHtml,
    Uptime
};
  