import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

function createFolder(folder: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder: string;

    if (file.mimetype.startsWith("image/")) {
      folder = path.join(UPLOAD_ROOT, "images");
    } else if (file.mimetype.startsWith("video/")) {
      folder = path.join(UPLOAD_ROOT, "videos");
    } else if (file.mimetype.startsWith("audio/")) {
      folder = path.join(UPLOAD_ROOT, "audios");
    } else if (file.mimetype === "application/pdf") {
      folder = path.join(UPLOAD_ROOT, "pdf");
    } else {
      return cb(new Error("Unsupported file type"), "");
    }

    createFolder(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const uniqueName = `${baseName}-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${ext}`;

    cb(null, uniqueName);
  },
});

const allowedTypes: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "audio/mpeg": [".mp3"],
  "application/pdf": [".pdf"],
};

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = allowedTypes[file.mimetype];

  if (!allowedExts || !allowedExts.includes(ext)) {
    return cb(new Error("File type not allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 10MB
  },
});
