const express = require('express');
const app = express();
const logger = require('../logger');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');

function Uptime(url) {
    switch (process.platform) {
        case 'win32':
        case 'darwin':
            logger("Your Operating System does not currently support Auto Uptime !");
            break;
        case 'linux':
            if (process.env.REPL_SLUG) {
                logger(`Activating uptime for ${chalk.underline(`'${url}'`)}`);
                return setInterval(function () {
                    axios.get(url).then(() => { }).catch(() => { });
                }, 10 * 1000);
            } else {
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
    });

    app.on('error', (error) => {
        logger(`An error occurred while starting the server: ${error}`);
    });
}

async function getUIDSlow(url) {
    var FormData = require("form-data");
    var Form = new FormData();
    var Url = new URL(url);
    Form.append('username', Url.pathname.replace(/\//g, ""));
    try {
        var response = await axios.post('https://api.findids.net/api/get-uid-from-username', Form, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Safari/537.36'
            }
        });
        var data = response.data;
        if (data.status !== 200) {
            throw new Error('Error!');
        }
        if (typeof data.error === 'string') {
            throw new Error("errr");
        } else {
            return data.data.id || "Not Found";
        }
    } catch (e) {
        throw e;
    }
}

async function getUIDFast(url) {
    var FormData = require("form-data");
    var Form = new FormData();
    var Url = new URL(url);
    Form.append('link', Url.href);
    try {
        var response = await axios.post('https://id.traodoisub.com/api.php', Form);
        var data = response.data;
        if (data.error) {
            throw new Error(data.error);
        } else {
            return data.id || "Not Found";
        }
    } catch (e) {
        throw e;
    }
}

async function getUID(url, callback) {
    try {
        var getUID = await getUIDFast(url);
        if (!isNaN(getUID)) {
            callback(null, getUID);
        } else {
            let getUIDSlowResult = await getUIDSlow(url);
            if (!isNaN(getUIDSlowResult)) {
                callback(null, getUIDSlowResult);
            } else {
                callback("UID not found", null);
            }
        }
    } catch (error) {
        callback(error.message, null);
    }
}

module.exports = {
    CreateSiteHtml,
    Uptime,
    getUID
};
