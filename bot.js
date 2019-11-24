var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');

var auth = require('./auth.json');
var params = require('./parameters.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'info';
var wolf_chanel=params.Chanel_wolf;
var little_girl_chanel=params.Chanel_little_girl;
var chances = 25;
var check_insults = false;
var insultes = fs.readFileSync('dictionaire.txt').toString().split("\r\n");
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Check if the it's someone in the wolf chanel
    if (channelID == wolf_chanel) {
        var random = Math.floor(Math.random() * Math.floor(100))+1
        if (random < chances){
            bot.sendMessage({
                to: little_girl_chanel,
                message: message
            });
        }
    }
    // listen for messages that will start with `!`
    else if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
            // !help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: '\r\n!chanel_little_girl <chanel_id> : change the little girl chanel (only the GM can do that)\r\n !chanel_wolf <chanel_id> : change the wolf chanel (only the GM can do that)\r\n !chances <number between 0 and 100> : change the probability to eavesdrop (only the GM can do that)\r\n !ping : respond pong!\r\n !insult : insult yourself\r\n '
                });
            break;
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'checker':
                if(params.GM_ID == userID){
                    var response;
                    if(typeof args[1] !== 'undefined' ){
                        
                        if(args[1] == 'on'){
                            check_insults = true;
                            response = 'The insult checker is changed to '+args[1];
                        }else if (args[1] =='off'){
                            check_insults = false;
                            response = 'The insult checker is changed to '+args[1];
                        }
                    }else{
                        response = 'You MotherFucker! Wrong argument your message must be in this form : !checker <on/off>'
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: response
                    });
                }
            break;
            // !insult
            case 'insult':
                var insult=insultes[Math.floor(Math.random() * Math.floor(insultes.length))];
                bot.sendMessage({
                    to: channelID,
                    message: insult+' ! '+"<@!" + userID + ">"
                });
            break;
            // !chances
            case 'chances':
                if(params.GM_ID == userID){
                    var response;
                    if(typeof args[1] !== 'undefined' && !isNaN(parseInt(args[1], 10)) && args[1] <= 100 && args[1] >= 0){
                        response = 'Chances of a message being eavesdrop changed to '+args[1]+'%'
                        chances = parseInt(args[1], 10);
                    }else{
                        response = 'You MotherFucker! Wrong argument your message must be in this form : !chances <number between 0 and 100>'
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: response
                    });
                }
            break;
            // !chanel_wolf
            case 'chanel_wolf':
                if(params.GM_ID == userID){
                    var response;
                    if(typeof args[1] !== 'undefined' && !isNaN(parseInt(args[1], 10))){
                        response = 'The new chanel of the wolfs is '+"<@!" + args[1] + ">"
                        wolf_chanel = args[1];
                    }else{
                        response = 'You MotherFucker! Wrong argument your message must be in this form : !chanel_wolf <chanel_id>'
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: response
                    });
                }
            break;
            // !chanel_little_girl
            case 'chanel_little_girl':
                if(params.GM_ID == userID){
                    var response;
                    if(typeof args[1] !== 'undefined' && !isNaN(parseInt(args[1], 10))){
                        response = 'The new chanel of the little girl is '+"<@!" + args[1] + ">"
                        little_girl_chanel = args[1];
                    }else{
                        response = 'You MotherFucker! Wrong argument your message must be in this form : !chanel_little_girl <chanel_id>'
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: response
                    });
                    
                }
            break;
         }
     }
     // this is not a wolf or command
     else if (check_insults){
        if(userID != bot.id ){
            insultes.forEach(function(element) {
                const regex = new RegExp('\\b' + element.toLowerCase() + '\\b');
                if(regex.test(message.toLowerCase())){
                    logger.debug('insulte détecté !');
                    bot.sendMessage({
                        to: channelID,
                        message: 'Hey their is kids here, you mother fucker! '+"<@!" + userID + ">"
                    });
                    
                }
            });
        }
     }
});