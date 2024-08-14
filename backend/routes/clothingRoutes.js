import express from 'express';
import { uploadImage, getImageById, getAllClothingItems, getClothingItemsByType, deleteClothingItem, registerUser, logoutUser, authenticateToken } from '../controllers/clothingController.js';
import { upload } from '../configurations/aws.js';

const router = express.Router();

//remove authenticate Token if you are simply experimenting

router.post('/upload', authenticateToken, upload.single('image'), uploadImage);
router.get('/items', authenticateToken, getAllClothingItems);
router.get('/items/type/:type', authenticateToken, getClothingItemsByType);
router.get('/items/:id', authenticateToken, getImageById);
router.delete('/delete/:id', authenticateToken, deleteClothingItem);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

export default router;
