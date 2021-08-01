## Choose Discord Bot


<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>
## About The Project
Bot have two functionality these are:
1. Database of youtube url that you can add and remove with specific command name. Purpose is you can add a sound effect that you like and play it anytime you want
2. Giveaway type of thing. You can add multiple options and let the bot randomly pick one of them.

### Built With
*[NODE.JS](https://nodejs.org)
*[Discord.js](https://discord.js.org)
*[FFMPEG](https://www.ffmpeg.org)
*[MONGODB](https://www.mongodb.com/)

## Getting Started
This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these steps.

### Prerequisites
* Node.js
* npm

### Installation
1. Get a Discord token
2. Get a MongoDB uri
3. Create .env file that contains these variables
```sh
PORT={PORT FOR HTTP SERVER}
MONGODB_URI={YOUR URI}
TOKEN={YOUR DISCORD TOKEN}
```
4.Install NPM packages
```sh
npm install
```
5.Start http server
```sh
node main.js
```

## Usage
1. Usage for youtube sounds
```sh
*- Adding new sound = *add *[command name] [youtube url for sound] 
*- Ses Silmek için = *delete *[command name]
*- Listing all existing sounds = *help sounds
```
2.Usage for giveaway
```sh
!sec [option1] [option2]...
Seperate all options with space
```


