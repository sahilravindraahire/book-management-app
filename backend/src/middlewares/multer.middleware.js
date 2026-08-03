import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.join(process.cwd(), "public", "temp");

fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, tempDir);
  },

  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for a cover"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});


// import multer from "multer"
// import path from "path"

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/temp")
//     },
//     filename:  function (req, file, cb) {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
//         cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith("image/")){
//         cb(null, true)
//     } else {
//         cb(new Error("Only image files are allowed for a cover"), false)
//     }
// }

// export const upload = multer({
//     storage,
//     fileFilter,
//     limits: {fileSize: 10 * 1024 * 1024}  
// })