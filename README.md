# Karuta Multi Tag

This discord bot will help you tag multiple cards at a time after you called a kc screen. This was originally created to tag all the cards I wanted to burn but then it takes too long to copy and paste one by one. Its functionality should support this goal the most, organizing is an afterthought. This will be updated pretty often just for a fun project

## Requirements

- [Node.js](http://nodejs.org/)
- [Discord](https://discordapp.com/) account

## Commands 

- Prefix: ~kt
- Subcommands: 
    - <tag_name> your existing tag name, will default to burn if nothing is entered
    - <edition> the specific edition you would like to tag, will default to 1 is nothing is entered. If you don't enter a tag name before edition, this won't work as you imagined
      * an option to tag all will be included in a later version soonTM
- Examples: 
    - ~kt - this will tag all the ed2 cards as burn
    - ~kt hot 3 - this will tag all the ed3 cards as hot
    - ~kt 3 - IMPORTANT: this will tag all the ed1 cards as 3
