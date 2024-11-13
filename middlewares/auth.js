import jwt from 'jsonwebtoken'
import CONFIG from '../config.json' with {type: "json"}

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1]; // Bearer token

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, CONFIG.jwt_secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


export default authMiddleware
// module.exports = authenticate
//Authentication Middleware:
//This middleware checks for an authorization header in the request.
//If present, it logs a success message and calls next().
//If the header is missing, it responds with a 401 Unauthorized status.



// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
// THis command generates a JWT SECRET string