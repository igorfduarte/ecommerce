import path from "path";
import express from "express";
import multer from "multer";
import { initializeApp } from "firebase/app";
import {getStorage,ref,uploadBytesResumable,uploadBytes} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAR8iuxz9Vk1Yi5jx6zpxek3RVKKD6t0tw",
  authDomain: "techshop-10c2d.firebaseapp.com",
  projectId: "techshop-10c2d",
  storageBucket: "techshop-10c2d.appspot.com",
  messagingSenderId: "386089941341",
  appId: "1:386089941341:web:4c5a88a8044fb57a9550b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storagegoogle = getStorage(app)

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  const newPath = req.file.path.replace("\\", "/").replace("\\", "/");

 
  res.send(`${newPath}`);
});

router.post("/multer", (req, res) => {
  //const newPath = req.file.path.replace("\\", "/").replace("\\", "/");

  const imagesRef = ref(storagegoogle,`image/${req.files.image.name}`)
  uploadBytesResumable(imagesRef,req.files)

  //res.send(`${newPath}`);
});





export default router;
