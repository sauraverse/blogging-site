const { verifyToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
    return function(req, res, next){
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) return next();
        try{
            const userPayload = verifyToken(tokenCookieValue);
            req.user = userPayload;
        }
        catch{}
        return next();
    }
}

module.exports = checkForAuthenticationCookie;
