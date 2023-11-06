const crypto = require('crypto');
const aes = require("aes-js");

function encryptState(data, key, name) {
    const salt = crypto.randomBytes(16);
    const hashEngine = crypto.createHash("sha256");
    const hashKey = hashEngine.update(key + salt.toString('hex')).digest();
    const iv = crypto.randomBytes(16);

    const jsonData = JSON.stringify(data);
    const bytes = aes.utils.utf8.toBytes(jsonData);

    const aesCtr = new aes.ModeOfOperation.ctr(hashKey, new aes.Counter(5), iv);
    const encryptedData = aesCtr.encrypt(bytes);
    const result = salt.toString('hex') + iv.toString('hex') + aes.utils.hex.fromBytes(encryptedData);
    
    const encryptedAppState = {};
    encryptedAppState[name] = result;

    return JSON.stringify(encryptedAppState); 
}

function decryptState(data, key, name) {
    const jsonData = JSON.parse(data);
    const appstateData = jsonData[name];

    const salt = Buffer.from(appstateData.slice(0, 32), 'hex');
    const iv = Buffer.from(appstateData.slice(32, 64), 'hex');
    const encryptedData = aes.utils.hex.toBytes(appstateData.slice(64));
    const hashEngine = crypto.createHash("sha256");
    const hashKey = hashEngine.update(key + salt.toString('hex')).digest();

    const aesCtr = new aes.ModeOfOperation.ctr(hashKey, new aes.Counter(5), iv);
    const decryptedData = aesCtr.decrypt(encryptedData);
    const jsonDataString = aes.utils.utf8.fromBytes(decryptedData);

    return JSON.parse(jsonDataString);
}

module.exports = {
    encryptState: encryptState,
    decryptState: decryptState
};
