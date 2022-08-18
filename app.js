const SpotifyWepApi = require("spotify-web-api-node");

class fredster extends SpotifyWepApi {
    constructor() {
        super();
        
        this.dotenv = require("dotenv").config();
        this.sqlite = require("sqlite3");
        this.fs = require("fs");
        this.request = require("request");
        this.express = require("express");
        this.app = this.express();
        this.querystring = require("querystring");

        this.utils = new Map();
        this.timers = new Map();
        this.name = "fredster";
    }

    async setupCreds() {
        return new Promise((resolve) => {
            this.setAccessToken('tbd');
            this.setRefreshToken('tbd');
            this.setRedirectURI(process.env.REDIRECT_URI);
            this.setClientId(process.env.CLIENT_ID);
            this.setClientSecret(process.env.CLIENT_SECRET);

            console.log("Setup credentials for fredster");
            resolve();
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

    async authorise() {
        return new Promise((resolve) => {
            this.app.get("/", (req, res) => {
                // https://developer.spotify.com/documentation/general/guides/authorization/scopes/
                let scope = "playlist-modify-public playlist-modify-private";
                let redirect_link = "https://accounts.spotify.com/authorize?" +
                    this.querystring.stringify({
                        response_type: 'code',
                        client_id: process.env.CLIENT_ID,
                        scope: scope,
                        redirect_uri: process.env.REDIRECT_URI
                    });

                res.redirect(redirect_link);             
            });

            this.app.get("/callback", async(req, res) => {
                res.send("time2steal all ur data lol");
            
                let code = req.query.code || null;
                if (!code) return console.error("Auth code not retrieved.");
                // from https://github.com/thelinmichael/spotify-web-api-node#usage
                  let data = await this.authorizationCodeGrant(code);
                  let expiry = data.body['expires_in'];
                  let accessToken = data.body['access_token'];
                  let refreshToken = data.body['refresh_token'];

                  // not needed log, testing only
                  console.log('The token expires in ' + expiry);
                  console.log('The access token is ' + accessToken);
                  console.log('The refresh token is ' + refreshToken);

                  this.setAccessToken(accessToken);
                  this.setRefreshToken(refreshToken);
                  resolve();
            });

            this.app.listen(8888, () => {
                console.log("Listening on 8888.");
            });
        });
    }

    // testing only
    sayHi() {
        return "Hello!";
    }

    async start() {
        await this.setupCreds();
        await this.loadUtils();
        await this.loadTimers();
        await this.loadDatabase();
        await this.authorise();

        // IF MORE TIMERS then run according to <export>.time (s)
        setInterval(this.refreshToken, 300 * 100, this)

        console.log("Startup complete");
        await this.addSongsToPlaylist(this);
    }
}

module.exports = fredster;