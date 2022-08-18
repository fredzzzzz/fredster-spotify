function addSongsToPlaylist(fredster) {
    // EXAMPLE add to playlist any song containing "fred" (album, artist, name)
    let playlistId = "5Z2IpoHid3mDJkUzMgLiHd";

    fredster.searchTracks("fred").then(function(data) {
        return data.body.tracks.items;
    }).then(function(songs) {
        let formattedSongs = songs.map((s) => `spotify:track:${s.id}`);
        fredster.addTracksToPlaylist(playlistId, formattedSongs)
        .catch((e) => console.error("Error adding to a playlist" + e));

        console.log("Added to playlist successfully");
    });
}

module.exports = addSongsToPlaylist;