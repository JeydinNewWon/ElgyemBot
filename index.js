const Discord = require('discord.js');
const logger = require('./utility/logger.js');
const CMD = require('./utility/commandHandler.js');

const bot = new Discord.Client();
const config = require('./config/config.json');
const token = config.bot_token;
const commandPrefix = config.command_prefix;

logger.info('Attempting to log in...');
logger.info('Using bot token: ' + token);

bot.login(token).then(() => {
        logger.info("Successfully logged into Discord.");
        logger.info(`Logged in as ${bot.user.username}#${bot.user.discriminator}. ID: ${bot.user.id}`);
    })
    .catch((err) => {
        logger.info("Error Logging in: " + err.message);
    });

logger.info('Finished initialisation.');

bot.on('ready', () => {
    bot.user.setStatus("online").then(() => {
        logger.info("Set status to online");
    });
    logger.info("Attempting to load commands...");
    CMD.init();
});

bot.on('message', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(commandPrefix)) {
        message.botUser = bot;
        message.prefix = commandPrefix;
        CMD.checkCommand(message);
    }
});

bot.on('error', (err) => {
    logger.error(err);
});