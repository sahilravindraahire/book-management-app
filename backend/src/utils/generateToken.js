import jwt from "jsonwebtoken"

const generateAccessToken = (user) => {
    return jwt.sign(
        {_id: user._id, email: user.email, name: user.name},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {_id: user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export {generateAccessToken, generateRefreshToken}