const SpotifyWebApi = require("spotify-web-api-node");

class fredster {
    constructor() {
        this.dotenv = require("dotenv").config();
        this.sqlite = require("sqlite3");
        this.fs = require("fs");

        this.utils = new Map();

        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: "https://www.geoguessr.com/maps/5cd30a0d17e6fc441ceda867/play"     
        });
    }

    async loadUtils() {
        return new Promise((resolve) => {
            this.fs.readdir("./utils/", async(e, utils) => {
                if (e) return console.error("Error loading utils: " + e);
                if (!utils.length) return console.log("No utils found.");
    
                let loadedUtils = [];
                for (const util of utils) {
                    if (!util.endsWith(".js")) return;
    
                    let path = require(`./utils/${util}`);
                    let name = util.split(".")[0];
    
                    this[name] = path;
                    loadedUtils.push(name)
                }
    
                console.log("Loaded utils: " + loadedUtils.map((u) => u).join(", "));
                resolve();
            });
        });
    }

    async start() {
        await this.loadUtils();
        this.loadDatabase();
    }
}

module.exports = fredster;