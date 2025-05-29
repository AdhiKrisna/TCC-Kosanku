import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import bucket from "../config/gcs.js";

// Multer setup with memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB misalnya
});

// Upload function to GCS
export const uploadToGCS = (req, res, next) => {
    
    console.log("req.file: ", req.file);
    console.log("req.files: ", req.files);
    const files = req.files || (req.file ? [req.file] : []);
    console.log("files: ", files);
    if (files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    // const files = req.files;
    const uploads = [];

    files.forEach((file) => {
        const gcsFileName = `image_kos/${uuidv4()}${path.extname(file.originalname)}`;
        const blob = bucket.file(gcsFileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype
            }
        });

        uploads.push(new Promise((resolve, reject) => {
            blobStream.on("error", reject);

            blobStream.on("finish", async () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                file.gcsUrl = publicUrl;
                resolve();
            });

            blobStream.end(file.buffer);
        }));
    });

    Promise.all(uploads)
        .then(() => next())
        .catch(err => {
            console.error("GCS upload error:", err);
            res.status(500).json({ message: "Failed to upload to Cloud Storage", error: err.message });
        });
};

export default upload;
