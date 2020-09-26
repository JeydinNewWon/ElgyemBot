const config = require('../config/config.json');
const fail = config.fail_emoji;
const success = config.success_emoji;
const logger = require('../utility/logger');
const ownerID = config.owner_id;

function execute(msg) {
    var voice = msg.guild.voice;
    if (voice) {
        if (msg.author.id === ownerID) {
            voice.connection.disconnect();
            voice.channel.leave();
            msg.channel.send(`${success} Successfully disconnected from voice channel.`);

        } else {
            msg.channel.send(`${fail} Only AzNFuRy is permitted to use that.`);
            return;
        }

    } else {
        msg.channel.send(`${fail} I am not connected to a voice channel.`);
        logger.warn('Not connected to a voice channel.');
        return;
    }
}

module.exports = {
    "name": "stop",
    "execute": execute
}