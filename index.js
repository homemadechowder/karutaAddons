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

const karutaBurnHandler = (tag, message, ed) => {
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
      .setColor("#0099ff")
      .setTitle("Karuta Tag")
      .setDescription("```" + karutaBurn(currentTag, cards, ed) + "```");

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
  // bot.channels.get('875133028588982283').send('bruh');
});

bot.on("interactionCreate", async (interaction) => {
  const { description } = interaction.message.embeds[0];
  const textToCopy = description.split("```");
  clipboardy.writeSync(textToCopy[1]);

  await interaction.reply("Copied");
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
    if (msg.channel.id !== "875133028588982283") {
      msg.reply("You can't run this command on this channel");
      return;
    }

    if (typeof currentCard.embeds === "undefined") {
      msg.reply(
        "No card set has been recorded, please run your karuta command first"
      );
      return;
    }
    const tag = parsed.arguments[0];
    const ed = parsed.arguments[1];
    karutaBurnHandler(tag || "burn", currentCard, ed);
  }
});
