/*

# This bot created for deciding all kind of stuff
# You can use it if you are stuck between multiple options
# Example usage !sec [element1] [element2] 
# Elements must split by space
# Required at least 2 element

*/


const Discord = require('discord.js');
const client = new Discord.Client();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(process.env.GOOGLE_API || "a");
// contains all existing commands
let commands = [];
const MongoClient = require('mongodb').MongoClient;
const MongoDbUrl = process.env.MONGODB_URI || "mongodb+srv://Cengizhan:Cengiz53@cengizhan-qpwns.mongodb.net/test?retryWrites=true&w=majority";
var voiceChannel = null;
//load all commands to array
getAllSoundCommandsFromDatabase()
client.on('ready', async () => { 
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!sec help and *help"); 
});

// This function called when someone send message
client.on('message', async msg => {
    // if the message owner our bot ignore it
    if (msg.author.bot) return;
    if(msg.content == "*leave" && voiceChannel != null){
        voiceChannel.leave();
        voiceChannel = "";
    }
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
    if(msg.content == "*leave") return;
    if(msg.content.startsWith("*help"))
    {
        soundHelp(msg);
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
    voiceChannel = msg.member.voice.channel;
    // if voice channel can't find that means owner of the message not in a voice channel. Throw an error.
    if (!voiceChannel) return msg.channel.send('Önce Odaya Gir Orospu Evladı!');
    if(!checkCommandExist(msg)) return msg.reply("Komut Bulunamadı");

    let songUrl;
    // find the song url from the given command
    commands.forEach(element=>{
        if (element.command == msg.content) songUrl = element.link;
    });
    try {
        //get the voice channel connection
        var connection = await voiceChannel.join();
        // play the mp3
        const dispatcher = connection.play(ytdl(songUrl))
            .on('finish', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log("reason: " + reason);
                voiceChannel.leave();
                voiceChannel = null;
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
    //get msg
    let array = msg.content.split(" ");
    //slice the prefix command (example *add, *delete)
    array.shift();
    // Check the msg syntx correct
    if (array.length != 2 && !array[0].startsWith("*")) {
        msg.reply("\`\`\` Doğru kullanım *add [*ses komutu ] [ses yt linki]\`\`\`");
        return;
    }
    //regExp for youtube link
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    let match = array[1].match(regExp);
    //if youtube link is correct take link and command to variable
    if (match && match[2].length == 11) {
        if(array[0] == "*leave") return;
        let command = {
            command: array[0],
            link: array[1]
        };
        //push variable to commands array
        commands.push(command);
        //add command to database
        addNewSoundToDatabase(command);
    }
    else return msg.reply("Youtube linki doğru değil");
    
}
//Add given sound command to database example {command : "*hi" , link: "some youtube url"}
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
//Get all command from the database that previously added and assign into a commands array
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
//Check the command exist in commands array
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
//Delete a sound command from commands array and the database
function deleteSound(msg){
    command = msg.content.split(" ");
    command.shift();
    commands = commands.filter((element) => {
        return !(element.command == command[0])
    });
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
}
//Help message for usage of the bot
function soundHelp(msg){
    let message =
        " \`\`\`\n" +
        "1- Yeni Ses Eklemek İçin = *add *[yeni ses komutu] [yeni ses youtube linki] \n" +
        "2- Ses Silmek için = *delete *[silinecek sesin komutu]\n" +
        "3- Kayıtlı Sesleri Listelemek İçin *help sounds \n" +
        "\`\`\`";
    if(msg.content == "*help sounds"){
        let count = 1;
        message = "\`\`\`\n";
        commands.forEach(element=>{
            message += count + "- " + element.command + "\n"; 
            count++;
        })
        message += "\`\`\`\n";
    }
    msg.reply(message);
    
}
//Discord token
client.login(process.env.TOKEN || "NjQwNTg0Nzc5MzgwNTU1ODA0.Xdmo9w.r9_KZZXxTnBC7g1PITK8is5W-4Y");