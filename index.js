require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const karutaBurn = require('./karutaBurn');

bot.login(TOKEN);

const karutaBurnHandler = (tag, message) => {
  if (message.embeds[0]?.title === 'Card Collection'){
    const currentTag = tag === '' ? 'burn' : tag;
    const cards = message.embeds[0].description;
    message.channel.send(`Copy this string to mass tag ${currentTag}:\n${karutaBurn(currentTag, cards)}`);
  }
  return;
}

let currentCard = '';
const setCurrentCard = (msg) =>{
  if (msg.embeds[0]?.title === 'Card Collection'){
    currentCard = msg;
  }
  return;
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  const message = new Discord.Message({content:'Hello There'})
  bot.channels.get('875133028588982283').send(message);
});

bot.on('messageUpdate', (oldMsg, newMsg) =>{
  setCurrentCard(newMsg);
})

bot.on('message', msg => {

  setCurrentCard(msg);
  if (msg.content.startsWith('~kt')) {
    if (msg.channel.id !== '875133028588982283') {
      msg.reply("You can't run this command on this channel")
      return;
    }

    if (typeof currentCard.embeds === 'undefined'){
      msg.reply("No card set has been recorded, please run your karuta command first");
      return;
    }

    const msgCommand = msg.content.split('~kt');
    const tag = msgCommand[1].trim(); //There should be another method that does this
    karutaBurnHandler(tag, currentCard);
  }
});
