function addPlaylist(fredster) {
    fredster.createPlaylist("made by fredster", {"description": "epicly made by a bot"})
    .then((data) => {
        console.log("Created playlist successfully");
    }).catch((e) => {
        console.error("Error whilst creating a playlist: " + e);
    });
}

module.exports = addPlaylist;