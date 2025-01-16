import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import fs module to check and create directories

// Define storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    
    // Check if the uploads directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create uploads folder if it doesn't exist
    }
    
    // Set the destination folder for file uploads
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename by appending the timestamp to avoid conflicts
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension); // Save with unique timestamp
  },
});

// Multer configuration
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true); // Accept video files
  } else {
    cb(new Error('Invalid file type. Only video files are allowed'));
  }
};

// Export the multer upload middleware
export const upload = multer({ storage, fileFilter });
