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
// contains all existing commands
let commands = [];
const MongoClient = require('mongodb').MongoClient;
const MongoDbUrl = 'mongodb+srv://Cengizhan:Cengiz53@cengizhan-qpwns.mongodb.net/test?retryWrites=true&w=majority';

getAllSoundCommandsFromDatabase()
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!sec help and *help"); 
    
});

// This function called when someone send message
client.on('message', async msg => {
    // if the message owner our bot ignore it
    if (msg.author.bot) return;

    if(msg.content.startsWith('*') && msg.content.length > 1){
        Sounds(msg);
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
    }
});

async function Sounds(msg){
    if(msg.content == "*help")
    {
        msg.reply("\`\`\`*öldü=Adam Öldü Amk\n*ben=Ben Orospu Çocuğuyum(Ferit)\n*bruh=Bruh\n*siktimseni=Siktim Seni\n*aaa=AaaKikiki\`\`\`");
        return;
    }
    if(msg.content.startsWith("*add"))
    {
        addNewSound(msg);
        return;
    }
    if(msg.content.startsWith("*delete")){
        deleteSound(msg);
        return;
    }
    // get the voice channel
    const voiceChannel = msg.member.voice.channel;
    // if voice channel can't find that means owner of the message not in a voice channel. Throw an error.
    if (!voiceChannel) return msg.channel.send('Önce Odaya Gir Orospu Evladı!');
    if(!checkCommandExist(msg)) return msg.reply("Komut Bulunamadı");

    let songUrl;
    commands.forEach(element=>{
        if (element.command == msg.content) songUrl = element.link;
    });
    try {
        //get the voice channel connection
        var connection = await voiceChannel.join();
        // play the mp3
        const dispatcher = connection.play(ytdl(songUrl))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log("reason: " + reason);
                voiceChannel.leave();
            })
            .on('error', error => console.error('on Error Dispatcher:  ' + error));
        // set volume
        dispatcher.setVolumeLogarithmic(1);
    }
    catch (error) {
        console.log(error);
    }
}

function addNewSound(msg){
    let array = msg.content.split(" ");
    array.shift();

    if (array.length != 2 && !array[0].startsWith("*")) {
        msg.reply("\`\`\` Doğru kullanım *add [*ses komutu ] [ses yt linki]\`\`\`");
        return;
    }
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    let match = array[1].match(regExp);
    if (match && match[2].length == 11) {
        let command = {
            command: array[0],
            link: array[1]
        };
        commands.push(command);
        addNewSoundToDatabase(command);
    }
    else return msg.reply("Youtube linki doğru değil");
    
}

function addNewSoundToDatabase(command){
    const dbClient = new MongoClient(MongoDbUrl, {
        useNewUrlParser: true
    });
    dbClient.connect(err=>{
        const db = dbClient.db("DiscordBot");
        const collection = db.collection("Sounds");
        collection.insertOne({command : command.command, link: command.link});
        dbClient.close();
    });
}

async function getAllSoundCommandsFromDatabase(){
    const dbClient = new MongoClient(MongoDbUrl, {
        useNewUrlParser: true
    });
    dbClient.connect(async function(err){
        if (err) console.log(err);
        const db = dbClient.db("DiscordBot");
        const collection = db.collection("Sounds");
        commands = await collection.find({}).toArray();
        dbClient.close();
    });
}

function checkCommandExist(msg){
    let command = msg.content;
    let found = false;
    console.log(commands);
    commands.forEach(element => {
        if(element.command == command){
            found = true;
        }
    });
    return found;
}

function deleteSound(msg){
    command = msg.content.split(" ");
    command.shift();

    const dbClient = new MongoClient(MongoDbUrl, {
        useNewUrlParser: true
    });
    dbClient.connect(async function (err) {
        if (err) console.log(err);
        const db = dbClient.db("DiscordBot");
        const collection = db.collection("Sounds");
        await collection.deleteOne({command : command[0]});
        dbClient.close();
    });
    commands = commands.filter((element)=>{
        return !(element.command == command[0])
    });
}
//Discord token
client.login(process.env.TOKEN || 'NjQxOTA5MDkyOTE4NzU1MzY4.XdXEDg.jwaOcIZur7rc4wSmbRYwGni488U');