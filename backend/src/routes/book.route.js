import {Router} from "express"
import {createBook, getBooks, getBookById, updateBook, updateBookStatus, deleteBook, getDashboardStats} from "../controllers/book.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.use(verifyJWT)

// router.get("/dashboard/stats", getDashboardStats)

// router.post("/", upload.single("coverImage"), createBook)
// router.get("/", getBooks)

// router.get("/:bookId", getBookById)
// router.patch("/bookId", upload.single("coverImage"), updateBook)

// router.patch("/:bookId/status", updateBookStatus)
// router.delete("/:bookId", deleteBook)

router.get("/dashboard/stats", getDashboardStats);

router.post("/", upload.single("coverImage"), createBook);
router.get("/", getBooks);

router.patch("/:bookId/status", updateBookStatus);
router.patch("/:bookId", upload.single("coverImage"), updateBook);

router.get("/:bookId", getBookById);
router.delete("/:bookId", deleteBook);

export default router