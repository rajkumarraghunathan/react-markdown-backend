const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {

    const { cookies } = req.headers;
    // cookies.accessToken
    if (cookies) {

        let user = jwt.verify(cookies, process.env.SCERET_KEY)

        req.user = user;
        if (!req.user) {
            return res.status(401).send({ messsage: 'Not Authorized!' })
        };

        return next();
    }
    res.status(401).send({ messsage: "Not Authorize,No accessToken" })
}