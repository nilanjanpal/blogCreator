const Blogs = require('./../models/blog');

exports.createPost = (req, res, next) => {
    console.log('POST');
    const url = req.protocol + '://' + req.get('host');
    const blog = new Blogs({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        userId: req.userId
    });
    blog.save().then(
        (data) => {
            res.status(201).json({
                message: 'Blog sucessfully added',
                blog: data
            });
        }
    );
};

exports.deletePost = (req, res, next) => {
    console.log('DELETE');
    Blogs.deleteOne({_id: req.params.id, userId: req.userId})
    .then(result => {
        if(result.n > 0) {
            res.status(200).json({message: 'Blog deleted successfully'});
        }
        else {
            res.status(401).json({message: 'Delete unsuccessful'});
        }
    })
};

exports.updatePost = (req, res, next) => {
    let imagePath;
    console.log('PUT');
    if(req.file !== undefined) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
        Blogs.updateOne({_id: req.body.id, userId: req.userId}, {title: req.body.title, content: req.body.content, _id: req.body.id, imagePath: imagePath, userId: req.userId})
        .then( result => {
            if(result.nModified > 0 ) {
                res.status(200).json({message: 'Blog update Successfully', imagePath: req.file !== undefined ? imagePath: null});
            }
            else {
                res.status(401).json({message: 'Update unsuccessful'})
            }
        });
    } else{
        Blogs.updateOne({_id: req.body.id, userId: req.userId}, {title: req.body.title, content: req.body.content, _id: req.body.id, userId: req.userId})
        .then( result => {
            if(result.nModified > 0 ) {
                res.status(200).json({message: 'Blog update Successfully', imagePath: req.file !== undefined ? imagePath: null});
            }
            else {
                res.status(401).json({message: 'Update unsuccessful'})
            }
        });
    }
};

exports.getPosts = (req, res, next) => {
    console.log('GET');
    let blogs;
    const queryParams = req.query;
    const pageSize = +queryParams.pageSize;
    const currentPage = +queryParams.currentPage;
    Blogs.find().skip(currentPage * pageSize).limit(pageSize)
    .then(
        (data) => {
            blogs = data;
            return Blogs.count();
        }
    )
    .then(
        (count) => {
            res.status(200).json({
                message: 'Blogs fetched.',
                blogs: blogs,
                userId: req.userId,
                totalCount: count
            });
        }
    );
};