const setTokenCookies = async ( res, accessToken, refreshToken, accessTokenExp, refreshTokenExp ) => {
    const accessTokenMaxAge = ( accessTokenExp - Math.floor(Date.now() / 1000 )) * 1000;
    const refreshTokenMaxAge = ( refreshToken - Math.floor(Date.now() / 1000 )) * 1000;

    // Set Cookie for Access Token
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: accessTokenMaxAge
    })

    // Set Cookie for Refresh Token
    res.cookie('refreshToken', accessToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: refreshTokenMaxAge
    })
}

export default setTokenCookies;