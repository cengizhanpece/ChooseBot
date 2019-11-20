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
const GOOGLE_API_KEY = process.env.GOOGLE_API;
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
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Önce Odaya Gir Orospu Evladı!');
        try {
            var video = await youtube.getVideo('https://www.youtube.com/watch?v=o17AgbomJag');
            return handleVideo(video, msg, voiceChannel);
        }
        catch (error) {

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


async function handleVideo(video, msg, voiceChannel){
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(`${song.title}** çalıyor`);
    }
    return undefined;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        console.log("!song ifinde");
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                console.log(song.url);
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log("reason: " + reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error('on Error Dispatcher:  ' + error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

}

//Discord token
client.login(process.env.TOKEN || 'NjQxOTA5MDkyOTE4NzU1MzY4.XdXEDg.jwaOcIZur7rc4wSmbRYwGni488U');