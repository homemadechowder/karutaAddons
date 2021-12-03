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
const _ = require("lodash");
const TOKEN = process.env.TOKEN;
const karutaBurn = require("./karutaBurn");
const { MessageActionRow, MessageButton, MessageEmbed } = Discord;

const BOT_COMMAND = "kt";
const RANDOM_IMAGE = ["https://i.imgur.com/vvZRFRv.png"];
const COMMAND_EDITION = ["1", "2", "3", "*"];

bot.login(TOKEN);

let currentCard = "";
const setCurrentCard = (msg) => {
  if (msg.embeds[0]?.title === "Card Collection") {
    currentCard = msg;
  }
  return;
};

const getEmbedDescription = (helpText) => {
  if (helpText) {
    return (
      `<@${currUser.id}>, Copy and paste the following code to tag your cards:\n` +
      "```" +
      karutaBurn(currentTag, cards, ed) +
      "```\n" +
      `Did you mean: \n` +
      "```" +
      `~kt burn ${ed}` +
      "```"
    );
  }

  return (
    `<@${currUser.id}>, Copy and paste the following code to tag your cards:\n` +
    "```" +
    karutaBurn(currentTag, cards, ed) +
    "```\n"
  );
};

const karutaBurnHandler = (tag, message, ed, currUser, helpText) => {
  if (message.embeds[0]?.title === "Card Collection") {
    const currentTag = tag === "" ? "burn" : tag;
    const cards = message.embeds[0].description;

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("primary")
        .setLabel("🎁")
        .setStyle("PRIMARY")
    );

    const embed = new MessageEmbed()
      .setColor("#E97451")
      .setAuthor("Karuta Multi Tag", "https://i.imgur.com/F3yStSS.png")
      .setDescription(
        `<@${currUser.id}>, Copy and paste the following code to tag your cards:\n` +
          "```" +
          karutaBurn(currentTag, cards, ed) +
          "```\n" +
          `${
            helpText
              ? "Did you mean: \n" + "```" + `~kt burn ${tag}` + "```\n"
              : ""
          }`
      )
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${currUser.id}/${currUser.avatar}.png`
      )
      .setImage("https://i.imgur.com/gtoBqvT.png");

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
  const newEmbed = { ...interaction.message.embeds };
  newEmbed[0].color = 3133855;
  const randomImageURL = _.sample(RANDOM_IMAGE);
  newEmbed[0].image.url = randomImageURL;
  await interaction.update({ embeds: [newEmbed[0]], components: [] });
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

  // If command is hit
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
    karutaBurnHandler(
      tag || "burn",
      currentCard,
      ed,
      msg.author,
      COMMAND_EDITION.includes(tag)
    );
  }
});
