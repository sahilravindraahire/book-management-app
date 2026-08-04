import jwt from "jsonwebtoken"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new apiError(401, "Unauthorized request")
        }
    
        let decoded
    
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            throw new apiError(401, "Invalid or expired access token")
        }
    
        const user = await User.findById(decoded._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(401, "Invalid access token: user not found")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "invalid access token")
    }
})