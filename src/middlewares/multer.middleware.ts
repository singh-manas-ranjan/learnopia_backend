import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/temp");
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
