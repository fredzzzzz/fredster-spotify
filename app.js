const SpotifyWebApi = require("spotify-web-api-node");

class fredster {
    constructor() {
        this.dotenv = require("dotenv").config();
        this.sqlite = require("sqlite3");
        this.fs = require("fs");
        this.request = require("request");

        this.utils = new Map();
        this.timers = new Map();
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

    async loadTimers() {
        return new Promise((resolve) => {
            this.fs.readdir("./timers/", async(e, timers) => {
                if (e) return console.error("Error loading timers: " + e);
                if (!timers.length) return console.log("No timers found.");

                let loadedTimers = [];
                for (const timer of timers) {
                    if (!timer.endsWith(".js")) return;

                    let path = require(`./timers/${timer}`);
                    let name = timer.split(".")[0];

                    this[name] = path;
                    loadedTimers.push(name);
                }

                // ADD FUNCTION TO RUN TIMERS IF NEEDED
                console.log("Loaded timers: " + loadedTimers.map((t) => t).join(", "));
                resolve();
            });
        })
    }

    async start() {
        await this.loadUtils();
        await this.loadTimers();
        await this.loadDatabase();

        console.log("Startup complete");
    }
}

module.exports = fredster;