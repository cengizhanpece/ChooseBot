/*

# This bot created for deciding all kind of stuff
# You can use it if you are stuck between multiple options
# Example usage !sec [element1] [element2] 
# Elements must split by space
# Required at least 2 element

*/


const Discord = require('discord.js');
const client = new Discord.Client();
const {Util} = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyBfuJsr2pdSiL9Hb3eZueoHHN52hpYqOaI');
const queue = new Map();



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!sec help");
});

// This function called when someone send message
client.on('message', async msg => {
    // if the message owner our bot ignore it
    if (msg.author.bot) return;

    if(msg.content == "*öldü"){
        const voiceChannel = msg.member.voice.channel;
        
        if (!voiceChannel) return msg.channel.send('Önce Odaya Gir Orospu Evladı!');
        try {
            
            var connection = await voiceChannel.join();
            const dispatcher = connection.play('./sounds/oldu.mp3')
                .on('end', reason => {
                    if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                    else console.log("reason: " + reason);
                    voiceChannel.leave();
                })
                .on('error', error => console.error('on Error Dispatcher:  ' + error));
            dispatcher.setVolumeLogarithmic(1);
        }
        catch (error) {
            console.log(error);
        }
    }

    
    if (msg.content.startsWith('!sec')) {
        let array = msg.content.split(" ");
        //only works for !sec. not something like !secaaa
        if(array[0] != "!sec") return;

        // if message content only !sec help reply how to use bot
        if(msg.content == "!sec help"){
            msg.reply("\`\`\` Örnek Kullanım: !sec [seçenek1] [seneçek2] \n (Seçenekleri boşluk ile ayırın).\`\`\`");
            return;
        }
        //delete !sec command from array (its here because we split the message)
        array.shift();
        //if array has only one element reply with error message and how to use bot
        if(array.length < 2){
            msg.reply("\`\`\` En az iki seçenek giriniz. \n Örn: !sec [seçenek1] [seneçek2]\`\`\`");
            return;
        }
        // get a random number 0 to array length
        let randomNumber = Math.floor(Math.random() * array.length);
        //reply a array index with choosen by random
        msg.reply("Kaderinde " + array[randomNumber] + " varmış");
    } else if (msg.author.username == "catay5" && msg.author.discriminator == "1235") {
        msg.reply("kes sesini lan");
    }
});


//Discord token
client.login(process.env.TOKEN || 'NjQxOTA5MDkyOTE4NzU1MzY4.XdXEDg.jwaOcIZur7rc4wSmbRYwGni488U');