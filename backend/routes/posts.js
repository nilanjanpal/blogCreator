const express = require('express');
const postController = require('./../controller/posts');
const multer = require('multer');
const router = express.Router();
const tokenVerify = require('./../middleware/route.guard');

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = 'Invalid File Type!';
        if(isValid) {
            error = "";
        }
        cb(error, 'backend/images'); 
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        const ext =  MIME_TYPE_MAP[file.mimetype];
        cb(null, fileName);
    }
});

router.post('', 
    tokenVerify,
    multer({storage: storage}).single('image'),
    postController.createPost
);

router.get('',
    postController.getPosts
);

router.delete('/:id',
    tokenVerify,
    postController.deletePost
);

router.put('',
    tokenVerify,
    multer({storage: storage}).single('image'),
    postController.updatePost
);

module.exports = router;