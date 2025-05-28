import express from "express";
import multer from "multer";
import {
  createKosImage,
  getAllKosImages,
  getImagesByKosID,
  updateKosImage,
  deleteKosImage,
} from "../controllers/kosImageController.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const KosImageRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Route definitions
KosImageRouter.get("/kos-images/", getAllKosImages); //ga kepake sih
KosImageRouter.get("/kos-images/kos/:kosId",verifyToken, getImagesByKosID);
KosImageRouter.post("/kos-images/kos/:kosId", verifyToken, upload.array("image_url", 5), createKosImage);
KosImageRouter.put("/kos-images/:id",verifyToken, upload.single("image_url"), updateKosImage);
KosImageRouter.delete("/kos-images/:id",verifyToken, deleteKosImage);

export default KosImageRouter;
