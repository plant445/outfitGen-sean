import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { s3 } from '../configurations/aws.js';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { validateUser, User } from '../models/user.js';
import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';


const SECRET = 'aslkdjbqwd1234879!@#$!@#%123dsaf'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.resolve(__dirname, '../data/clothingData.json');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //const token = req.cookies.token;

  if (!token) {
      return res.status(403).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
      const verified = jwt.verify(token, SECRET);
      req.user = verified; // Attach the verified user info to the request
      next(); // Proceed to the next middleware/route handler
  } catch (err) {
      res.status(401).json({ message: 'Invalid Token' });
  }
};

// Helper function to read data from the JSON file
const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(jsonData);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Schema for validation
const clothingItemSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().required(),
  imageUrl: Joi.string().required(),
  createdAt: Joi.date().default(Date.now),
});

const uploadImage = async (req, res) => {
    const { type } = req.body;
  
    if (!req.file) {
      return res.status(400).send({ message: 'Image file is required' });
    }
  
    try {
        const newItem = {
        id: uuidv4(),
        type,
        imageUrl: req.file.location,
        createdAt: new Date(),
        };

        const { error } = clothingItemSchema.validate(newItem);
        if (error) {
        return res.status(400).send({ message: error.details[0].message });
        }
  
        const clothingItems = readData();
        clothingItems.push(newItem);
        writeData(clothingItems);
        return res.status(201).json(newItem);
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return res.status(400).send({ message: 'Internal Server Error' });
    }
  };

const getImageById = (req, res) => {
  const { id } = req.params;
  const clothingItems = readData();
  const item = clothingItems.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  return res.status(200).json(item);
};

const getAllClothingItems = (req, res) => {
    const clothingItems = readData();
    return res.status(200).json(clothingItems);
};

const getClothingItemsByType = (req, res) => {
  const { type } = req.params;
  const clothingItems = readData();
  const items = clothingItems.filter(i => i.type === type);

  if (items.length === 0) {
    return res.status(404).json({ message: 'No items found' });
  }

  return res.status(200).json(items);
};

const deleteClothingItem = async (req, res) => {
    const { id } = req.params;
    const clothingItems = readData();
    const itemIndex = clothingItems.findIndex(i => i.id === id);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
    const [item] = clothingItems.splice(itemIndex, 1);
  
    // Delete the image from S3
    const deleteParams = {
      Bucket: 'clothes-selection',
      Key: item.imageUrl.split('amazonaws.com/').pop() // Extract the key from the imageUrl
    };
  
    try {
      await s3.send(new DeleteObjectCommand(deleteParams));
  
      // Write the updated array back to the JSON file
      writeData(clothingItems);
  
      return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item from S3:', error);
      return res.status(500).json({ message: error.message });
    }
  };

  const registerUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    try {
      let user = await User.findOne({ email: req.body.email });
      
      if (user) {
        // User exists, attempt to log in
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (!correctPassword) {
          return res.status(400).json({ message: 'Incorrect email or password.' });
        }
        if (user.name !== req.body.name) {
          return res.status(400).json({ message: 'Incorrect name.' });
        }
        
        // Generate token for logged in user
        const token = jwt.sign({ id: user._id }, SECRET);
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Set secure flag to true in production
          sameSite: "strict"
        });
        return res.status(201).json({ message: 'Successfully logged in', token: token });
        
      } else {
        // User does not exist, attempt to register
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        });
        await newUser.save();
        
        // Generate token for newly registered user
        const token = jwt.sign({ id: newUser._id }, SECRET);
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Set secure flag to true in production
          sameSite: "strict"
        });
        return res.status(201).json({ message: 'Successfully registered', user: newUser, token: token });
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };


const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Successfully logged out' });
};

export { uploadImage, getImageById, getAllClothingItems, getClothingItemsByType, deleteClothingItem, registerUser, logoutUser, authenticateToken };