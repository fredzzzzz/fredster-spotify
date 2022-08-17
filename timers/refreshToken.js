exports.time = 300 * 100;

function refreshToken(fredster) {
    let c_refreshToken = fredster.getRefreshToken();
    let c_accessToken = fredster.getAccessToken();
    console.log("Reading refresh token as: " + c_refreshToken);
    console.log("Reading access token as: " + c_accessToken);

    // from https://github.com/thelinmichael/spotify-web-api-node#usage
    fredster.refreshAccessToken().then(
        function(data) {
            console.log('The access token has been refreshed!');
        
            // Save the access token so that it's used in future calls
            fredster.setAccessToken(data.body['access_token']);
        },
        function(err) {
            console.log('Could not refresh access token', err);
        }
    )
}

module.exports = refreshToken;