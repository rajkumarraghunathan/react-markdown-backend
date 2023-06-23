const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {

    const { cookies } = req;

    if (cookies.accessToken) {

        let user = jwt.verify(cookies.accessToken, process.env.SCERET_KEY)

        req.user = user;
        if (!req.user) {
            return res.status(401).send({ messsage: 'Not Authorized!' })
        };

        return next();
    }
    res.status(401).send({ messsage: "Not Authorize,No accessToken" })
}