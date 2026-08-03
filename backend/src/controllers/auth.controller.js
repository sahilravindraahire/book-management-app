import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (![name, email, password].some((field) => field?.trim())) {
    throw new apiError(400, "Name, email and password are all required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new apiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new apiResponse(
        201,
        { user: createdUser, accessToken },
        "Account created successfully",
      ),
    );
});

export const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email?.trim() || !password?.trim()){
        throw new apiError(400, "Email and password are required")
    }

    const user = await User.findOne({email: email.toLowerCase()})

    if(!user){
        throw new apiError(401, "Invalid email or password")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new apiError(401, "Invalid email or password")
    }

    const {accessToken, refreshToken} = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
        new apiResponse(
            200,
            {user: loggedInUser, accessToken},
            "Logged in successfully"
        )
    )
})

export const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {refreshToken: 1}
    })

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new apiResponse(200, {}, "Logged out successfully"))
})

export const refreshAccessToekn = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Refresh token missing")
    }

    let decoded

    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new apiError(401, "Invalid or expired refresh token")
    }

    const user = await User.findById(decoded._id)

    if(!user || user.refreshToken !== incomingRefreshToken){
        throw new apiError(401, "Refresh token is invalid or has been used")
    }

    const {accessToken, refreshToken} = await generateTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, {
        ...cookieOptions, 
        maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new apiResponse(200, {accessToken}, "Access token refreshed"))
})

export const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new apiResponse(200, {user: req.user}, "Current user fetched"))
})