/* eslint-disable no-undef */
require("dotenv").config();

const Discord = require("discord.js");
const bot = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
  ],
});
const { parse } = require("discord-command-parser");
const TOKEN = process.env.TOKEN;
const karutaBurn = require("./karutaBurn");
const clipboardy = require("clipboardy");
const { copy } = require("copy-paste").global();
const { MessageActionRow, MessageButton, MessageEmbed } = Discord;
const BOT_COMMAND = "kt";

bot.login(TOKEN);

let currentCard = "";
const setCurrentCard = (msg) => {
  if (msg.embeds[0]?.title === "Card Collection") {
    currentCard = msg;
  }
  return;
};

const karutaBurnHandler = (tag, message, ed, currUser) => {
  if (message.embeds[0]?.title === "Card Collection") {
    const currentTag = tag === "" ? "burn" : tag;
    const cards = message.embeds[0].description;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("primary")
        .setLabel("Copy")
        .setStyle("PRIMARY")
    );

    const embed = new MessageEmbed()
      .setColor("#E97451")
      .setAuthor("Karuta Multi Tag", "https://i.imgur.com/F3yStSS.png")
      .setDescription(
        `<@${currUser.id}>, here's the code to your tagged cards\n` +
          "```" +
          karutaBurn(currentTag, cards, ed) +
          "```"
      )
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${currUser.id}/${currUser.avatar}.png`
      )
      .setImage("https://i.imgur.com/cRaaTrl.png");

    message.channel.send({
      content: " ",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  }
  return;
};

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  bot.user.setUsername("Karuta Multi Tag");
});

bot.on("interactionCreate", async (interaction) => {
  const { description } = interaction.message.embeds[0];
  const textToCopy = description.split("```");
  const newEmbed = { ...interaction.message.embeds };

  console.log(interaction);
  newEmbed[0].color = 3133855;
  newEmbed[0].image.url = "https://i.imgur.com/65jJIDg.png";
  await interaction.update({ embeds: [newEmbed[0]] });
  // clipboardy.write(textToCopy[1]);
  copy(textToCopy[1]);
});

bot.on("messageUpdate", (oldMsg, newMsg) => {
  setCurrentCard(newMsg);
});

bot.on("messageCreate", async (msg) => {
  setCurrentCard(msg);
  const parsed = parse(msg, "~", { allowSpaceBeforeCommand: true });
  if (!parsed.success) {
    return;
  }

  if (parsed.command === BOT_COMMAND) {
    // WIP
    // if (msg.channel.id !== "875133028588982283") {
    //   msg.reply("You can't run this command on this channel");
    //   return;
    // }

    if (typeof currentCard.embeds === "undefined") {
      msg.reply(
        "No card set has been recorded, please run your karuta command first"
      );
      return;
    }
    const tag = parsed.arguments[0];
    const ed = parsed.arguments[1];
    karutaBurnHandler(tag || "burn", currentCard, ed, msg.author);
  }
});
