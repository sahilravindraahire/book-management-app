import {Router} from "express"
import {registerUser, loginUser, logoutUser, refreshAccessToekn, getCurrentUser} from "../controllers/auth.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/refresh-token", refreshAccessToekn)
router.post("/logout", verifyJWT, logoutUser)
router.get("/me", verifyJWT, getCurrentUser)

export default router