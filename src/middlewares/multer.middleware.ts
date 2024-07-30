import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.join(__dirname, "../../public/temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const id = req.params.id;
    cb(
      null,
      `${file.fieldname}_${id}${file.originalname.substring(
        file.originalname.indexOf(".")
      )}`
    );
  },
});

export const upload = multer({ storage });
