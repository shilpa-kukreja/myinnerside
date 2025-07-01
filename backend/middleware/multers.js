import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads/team folder if it doesn't exist
const uploadPath = "uploads/team";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });
export default uploads;
