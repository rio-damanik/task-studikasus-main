const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const index = async (req, res, next) => {
    try {
        // pemanggilannya dengan cara http://localhost:3000/api/products?limit=10&skip=0
        //pagination
        const { limit = 0, skip = 0, q = '', category = '', tags = [] } = req.query;

        let criteria = {};

        if (q.length) {
            criteria = {
                ...criteria,
                name: { $regex: `${q}`, $options: 'i' }
            }
        }

        if (category.length) {
            const qCategory = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });
            if (qCategory) {
                criteria = {
                    ...criteria,
                    category: qCategory.id
                }
            }
        }

        if (tags.length) {
            tags.split(',');
            const aTags = tags.split(',')
            const qTags = await Tag.find({ name: { $in: aTags } });

            if (qTags.length > 0) {
                criteria = {
                    ...criteria,
                    tags: {
                        $in: qTags.map(tag => tag.id)
                    }
                }
            }
        }

        const count = await Product.find(criteria).countDocuments();
        const products = await Product.find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('category')
            .populate('tags');
        return res.json({
            data: count,
            products
        });
    } catch (err) {
        next(err);
    }
}

const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category').populate('tags');
        return res.json(product);
    } catch (err) {
        next(err);
    }
}

// untuk menyimpan data produk baru dengan menggunakan multer untuk file upload dan menyimpan file ke direktori public/images/products
const store = async (req, res, next) => {
    try {
        const payload = req.body;
        console.log(payload)
        if (payload.category) {
            // mencari kategori berdasarkan nama kategori yang diinputkan
            const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (!category) {
                // jika kategori tidak ditemukan maka akan membuat kategori baru
                const newCategory = new Category({ name: payload.category });
                // menyimpan kategori baru
                await newCategory.save();
                // mengubah id kategori yang diinputkan dengan id kategori baru
                payload.category = newCategory.id;
            } else {
                payload.category = category.id
            }
        }
        if (payload.tags) {
            // mencari tag berdasarkan nama tag yang diinputkan
            const tags = await Tag.find({ name: { $in: payload.tags } });
            // jika tag yang tidak ditemukan lebih dari 0 maka akan membuat tag baru
            payload.tags = tags.map(tag => tag.id)

            // mengubah id tag yang diinputkan dengan id tag yang sudah ada
        }
        if (req.file) {
            // mengambil path file yang diupload melalui form
            const tmp_path = req.file.path;
            // mengambil extensi file
            const originalExt = req.file.originalname.split('.').pop();
            // menggabungkan nama file dengan ekstensi
            const filename = req.file.filename + '.' + originalExt;
            // menggabungkan path file sementara dengan nama file dan ekstensi dan dijadikan path file tujuan
            const target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            // Membuat aliran baca dari file sumber
            const src = fs.createReadStream(tmp_path);
            // Membuat aliran tulis ke file tujuan
            const dest = fs.createWriteStream(target_path);
            // Menghubungkan aliran baca ke aliran tulis
            src.pipe(dest);

            // Menangani event 'end' ketika proses penyalinan selesai
            src.on('end', async () => {
                try {
                    const product = new Product({ ...payload, image_url: `http://localhost:3000/images/products/${filename}` });
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err);
                }
            });

            // Menangani event 'error' jika terjadi kesalahan
            src.on('error', async () => {
                next(err);
            });

        } else {
            const product = new Product(payload);
            await product.save();
            return res.json(product);
        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);

    }
}

const update = async (req, res, next) => {
    try {
        const payload = req.body;
        if (payload.category) {
            // mencari kategori berdasarkan nama kategori yang diinputkan
            const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (!category) {
                // jika kategori tidak ditemukan maka akan membuat kategori baru
                const newCategory = new Category({ name: payload.category });
                // menyimpan kategori baru
                await newCategory.save();
                // mengubah id kategori yang diinputkan dengan id kategori baru
                payload.category = newCategory.id;
            } else {
                payload.category = category.id
            }
        }
        if (payload.tags) {
            // mencari tag berdasarkan nama tag yang diinputkan
            const tags = await Tag.find({ name: { $in: payload.tags } });
            // jika tag yang tidak ditemukan lebih dari 0 maka akan membuat tag baru
            payload.tags = tags.map(tag => tag.id)

            // mengubah id tag yang diinputkan dengan id tag yang sudah ada
        }
        if (req.file) {
            // mengambil path file yang diupload melalui form
            const tmp_path = req.file.path;
            // mengambil extensi file
            const originalExt = req.file.originalname.split('.').pop();
            // menggabungkan nama file dengan ekstensi
            const filename = req.file.filename + '.' + originalExt;
            // menggabungkan path file sementara dengan nama file dan ekstensi dan dijadikan path file tujuan
            const target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            // Membuat aliran baca dari file sumber
            const src = fs.createReadStream(tmp_path);
            // Membuat aliran tulis ke file tujuan
            const dest = fs.createWriteStream(target_path);
            // Menghubungkan aliran baca ke aliran tulis
            src.pipe(dest);

            // Menangani event 'end' ketika proses penyalinan selesai
            src.on('end', async () => {
                try {
                    const productCurrent = await Product.findById(req.params.id);
                    const filenameCurrent = productCurrent.image_url.split('/').pop();
                    const currentImage = `${config.rootPath}/public/images/products/${filenameCurrent}`;
                    // jadi kalo ada file yang sama maka file yang lama akan dihapus
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }
                    const { id } = req.params;
                    const product = await Product.findByIdAndUpdate(id, { ...payload, image_url: `http://localhost:3000/images/products/${filename}` }, { runValidators: true, new: true });
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err);
                }
            });

            // Menangani event 'error' jika terjadi kesalahan
            src.on('error', async () => {
                next(err);
            });

        } else {
            const { id } = req.params;
            const product = await Product.findByIdAndUpdate(id, payload, { runValidators: true, new: true });
            return res.json(product);
        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);

    }
}

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        const currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
        }
        return res.json({ message: 'Product deleted', product });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    store,
    index,
    update,
    destroy,
    show

}