const client = require("./app.js");
const fredster = new client();
fredster.start();

process.on("unhandledRejection", (r, p) => {
    console.error(r, "Unhandled rej at promise", p);
});

process.on("uncaughtException", (e) => {
    console.error(e, "Uncaught Exception");
    process.exit(1);
});
