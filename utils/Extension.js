const express = require('express');
const app = express();
const logger = require('../logger');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');

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

async function getUIDSlow(url,api) {
    var FormData =  require("form-data");
    var Form = new FormData();
	var Url = new URL(url);
    Form.append('username', Url.pathname.replace(/\//g, ""));
	try {
        var data = await got.post('https://api.findids.net/api/get-uid-from-username',{
            body: Form,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Safari/537.36'
        })
	} catch (e) {
        console.log(global.Fca.Data.event.threadID,e)
        return api.sendMessage("Lỗi: " + e.message,global.Fca.Data.event.threadID);
	}
    if (JSON.parse(data.body.toString()).status != 200) return api.sendMessage('Error !',global.Fca.Data.event.threadID)
    if (typeof JSON.parse(data.body.toString()).error === 'string') return "errr"
    else return JSON.parse(data.body.toString()).data.id || "Not Found";
}

async function getUIDFast(url,api) {
    var FormData =  require("form-data");
    var Form = new FormData();
	var Url = new URL(url);
    Form.append('link', Url.href);
    try {
        var data = await got.post('https://id.traodoisub.com/api.php',{
            body: Form
        })
	} catch (e) {
        return api.sendMessage("Lỗi: " + e.message,global.Fca.Data.event.threadID,global.Fca.Data.event.messageID);
	}
    if (JSON.parse(data.body.toString()).error) return api.sendMessage(JSON.parse(data.body.toString()).error,global.Fca.Data.event.threadID,global.Fca.Data.event.messageID);
    else return JSON.parse(data.body.toString()).id || "Not Found";
}

async function getUID(url,api) {
    var getUID = await getUIDFast(url,api);
        if (!isNaN(getUID) == true) return getUID;  
            else {
                let getUID = await getUIDSlow(url,api);
            if (!isNaN(data) == true) return getUID;
        else return null;
    }
}       

module.exports = {
    CreateSiteHtml,
    Uptime,
    getUID
};
  