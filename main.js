const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.User.setGame("!sec help");
});

client.on('message', msg => {
    if (msg.content.startsWith('!sec')) {
        let array = msg.content.split(" ");
        if(msg.content == "!sec help"){
            msg.reply("\`\`\` Örnek Kullanım: !sec [seçenek1] [seneçek2] \n (Seçenekleri boşluk ile ayırın).\`\`\`");
            return;
        }
        array.shift();
        if(array.length < 2){
            msg.reply("\`\`\` En az iki seçenek giriniz. \n Örn: !sec [seçenek1] [seneçek2]\`\`\`");
            return;
        }
        let randomNumber = Math.floor(Math.random() * array.length);
        msg.reply("Kaderinde " + array[randomNumber] + " varmış");
    }
});

client.login('NjQwNTg0Nzc5MzgwNTU1ODA0.Xb7-YA._VF5eabibg5xCM_Grh2YeTd9C1g');