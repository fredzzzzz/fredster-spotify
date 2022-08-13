const SpotifyWebApi = require("spotify-web-api-node");

class fredster {
    constructor() {
        this.dotenv = require("dotenv").config();
        this.sqlite = require("sqlite3");
        this.fs = require("fs");
        this.request = require("request");
        this.express = require("express");
        this.app = this.express();
        this.querystring = require("querystring");
        this.spotify = new SpotifyWebApi({
            redirectUri: process.env.REDIRECT_URI,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        });

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

                console.log(process.env.REDIRECT_URI);
                res.redirect(redirect_link);             
            });

            this.app.get("/callback", (req, res) => {
                res.send("time2steal all ur data lol");
                
                let accessToken, refreshToken;
                let code = req.query.code || null;
                if (!code) return console.error("Auth code not retrieved.");
                // from https://github.com/thelinmichael/spotify-web-api-node#usage
                this.spotify.authorizationCodeGrant(code).then(
                    function(data) {
                        console.log('The token expires in ' + data.body['expires_in']);
                        console.log('The access token is ' + data.body['access_token']);
                        console.log('The refresh token is ' + data.body['refresh_token']);
                    
                        accessToken = data.body['access_token'];
                        refreshToken = data.body['refresh_token'];
                    },
                    function(err) {
                      console.log('Something went wrong!', err);
                    }
                  );        

                  this.spotify.setAccessToken(accessToken);
                  this.spotify.setRefreshToken(refreshToken);    
                  
                  // CALL TIMER TO REFRESH TOKEN EVERY 3500 SECONDS
            });

            this.app.listen(8888, () => {
                console.log("Listening on 8888.");
            });

            resolve();
        });
    }

    async start() {
        //this.setupURI();
        this.authorise();
        await this.loadUtils();
        await this.loadTimers();
        await this.loadDatabase();

        //this.setupURI();

        console.log("Startup complete");
    }
}

module.exports = fredster;