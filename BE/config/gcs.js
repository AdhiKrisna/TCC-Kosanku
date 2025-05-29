import { Storage } from "@google-cloud/storage";
// import path from "path";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const keyFilename =  isProduction ? null : path.resolve(process.env.GCS_KEY_FILE);
const storage = isProduction
  ? new Storage() // Use default service account in Cloud Build
  : new Storage({ //ini untuk local development
      projectId: process.env.GCS_PROJECT_ID,
      keyFilename: keyFilename
    });

// const storage = new Storage();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export default bucket;
