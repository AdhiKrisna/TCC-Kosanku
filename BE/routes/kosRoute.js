import express from 'express';
import { getAllKos, getKosById, createKos,deleteKos,updateKos } from '../controllers/KosController.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import multer from 'multer';

const KosRouter = express.Router();

const upload = multer({ dest: 'uploads/' }); // atau storage ke Cloudinary

// Define the route for getting all KOS
KosRouter.get('/kos',verifyToken, getAllKos); 

KosRouter.get('/kos/:id', verifyToken, getKosById); 
KosRouter.post('/kos', verifyToken, upload.array('image_url', 5), createKos); 
KosRouter.put('/kos/:id', verifyToken, updateKos);
KosRouter.delete('/kos/:id', verifyToken, deleteKos);
 
export default KosRouter;
