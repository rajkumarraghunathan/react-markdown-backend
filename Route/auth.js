const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {
    console.log(req);
    const { cookies } = req;
    console.log(cookies);

    if (cookies.accessToken) {
        console.log(cookies.accessToken);
        let user = jwt.verify(cookies.accessToken, process.env.SCERET_KEY)
        console.log(user);
        req.user = user;
        if (!req.user) {
            return res.status(401).send({ messsage: 'Not Authorized!' })
        };

        return next();
    }
    res.status(401).send({ messsage: "Not Authorize" })
}