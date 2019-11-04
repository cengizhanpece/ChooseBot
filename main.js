/*

# This bot created for deciding all kind of stuff
# You can use it if you are stuck between multiple options
# Example usage !sec [element1] [element2] 
# Elements must split by space
# Required at least 2 element

*/

// import discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!sec help");
});

// This function called when someone send message
client.on('message', msg => {
    if (msg.content.startsWith('!sec')) {
        let array = msg.content.split(" ");
        //only works for !sec not something like !secaaa
        if(array[0] != "!sec"){
            return;
        }
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

//Discord token
client.login(process.env.TOKEN);