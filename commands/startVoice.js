const config = require('../config/config.json');
const fail = config.fail_emoji;
const ownerID = config.owner_id;
const logger = require('../utility/logger');

function execute(msg) {
    var voiceChannel = msg.member.voice.channel;
    if (msg.author.id === ownerID) {
        if (voiceChannel) {
            const requiredPerms = ['CONNECT', 'SPEAK', 'MUTE_MEMBERS'];
            if (msg.guild.me.hasPermission(requiredPerms)) {
                if (voiceChannel.memberPermissions(msg.guild.me).has(requiredPerms)) {
                    if (!voiceChannel.connection) {
                        voiceChannel.join()
                            .then((connection) => {
                                msg.member.client.on('voiceStateUpdate', (oldState, newState) => {
                                    if (oldState.mute === false && newState.mute === true) {
                                        newState.channel.members.each((member) => {
                                            if (member.id !== ownerID && member.id !== msg.guild.me.id) {
                                                member.voice.setMute(true);
                                            }
                                        });
                                        logger.info('Successfully muted all members!');
                                    }

                                    if (oldState.mute === true && newState.mute === false) {
                                        console.log('moood');
                                        newState.channel.members.each((member) => {
                                            if (member.id !== ownerID) {
                                                member.voice.setMute(false);
                                            }
                                        });
                                        logger.info('Successfully unmuted all members!');
                                    }
                                });
                            });
                    } else {
                        msg.channel.send(`${fail} I am already in a voice channel.`);
                    }
                } else {
                    msg.channel.send(`${fail} I do not have permission to connect, speak or mute members in the voice channel.`);
                    return logger.warn('Insufficient permissions to connect, speak or mute members in the voice channel.'); 
                }
            } else {
                msg.channel.send(`${fail} I do not have permission to join the voice channel.`);
                return logger.warn('Insufficient permissions to join voice channel.');          
            }
        } else {
            msg.channel.send(`${fail} Please join a voice channel before starting.`);
            return logger.warn('Did not join a voice channel to start.');
        }
    } else {
        msg.channel.send(`${fail} Sorry, only AzNFuRy is permitted to use this bot.`);
    }    
}

module.exports = {
    "name": "start",
    "execute": execute
}