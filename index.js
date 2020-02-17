const mongoose = require('mongoose');
const express = require('express');
const Product = require('./Produce');
const upload = require('./uploadConfig');
const fs = require('fs');
const PORT = 3000;
//******************************************
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    Product.find({})
    .then(products => res.render('admin', { products }))
    .catch(err => res.send(err.message));
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.get('/admin', (req, res) => {
    Product.find({})
    .then(products => res.render('admin', { products }))
    .catch(err => res.send(err.message));
});

app.get('/xoa/:id', (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
    .then((product) => {
        res.redirect('/admin');
        if(product.image === 'default.png') return;
        const path = './public/images/background/' + product.image;
        fs.unlink(path, (err) => {
            if(err) throw err;
            console.log(`Deleted ${product.image}`);
        });
    })
    .catch(err => res.send(err.message));
});

app.get('/sua/:id', (req, res) => {
    const { id } = req.params;
    Product.findById(id)
    .then((product) => res.render('edit', { product }))
    .catch(err => res.send(err.message));
});

app.post('/add', upload.single('image'), (req, res) => {
    const { name, desc, video } = req.body;
    const image = req.file ? req.file.filename : 'default.png';
    const product = new Product({ name, desc, video, image });
    product.save()
    .then(() => res.redirect('/'))
    .catch(err => res.send(err.message));
    // res.send({ name, desc, video, image });
});

app.post('/update/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, desc, video, oldImage } = req.body; 
    const image = req.file ? req.file.filename : oldImage;
    Product.findByIdAndUpdate(id, { name, desc, video, image })
    .then(() => {
        res.redirect('/admin');
        if(req.file && req.file.filename !== oldImage) {
            const path = './public/images/background/' + oldImage;
            fs.unlink(path, (err) => {
                if(err) throw err;
                console.log(`Updated ${oldImage}`);
            });
        }
    })
    .catch(err => res.send(err.message));
});

//******************************************

// const URL = 'mongodb://localhost:27017/shop';
const URL = 'mongodb+srv://anhtuanit:caosuhu@mongodbproduct-ov1li.azure.mongodb.net/shop';

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server listen at port ${PORT}`));
});


