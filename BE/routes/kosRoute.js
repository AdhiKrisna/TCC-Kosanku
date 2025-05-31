import express from 'express';
import { getAllKos, getKosById, createKos,deleteKos,updateKos, getKosByOwnerId } from '../controllers/kosController.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
import upload, { uploadToGCS } from '../middlewares/gcsMulter.js';

const KosRouter = express.Router();

// const upload = multer({ dest: 'uploads/' }); // atau storage ke cloud storage

// Define the route for getting all KOS
KosRouter.get('/kos', getAllKos); 
KosRouter.get('/kos/:id', getKosById); 
KosRouter.get('/kos/owner/:id', getKosByOwnerId); 

KosRouter.post('/kos', verifyToken, upload.array('image_url', 5), uploadToGCS ,createKos); 
KosRouter.put('/kos/:id', verifyToken, updateKos);
KosRouter.delete('/kos/:id', verifyToken, deleteKos);
 
export default KosRouter;
