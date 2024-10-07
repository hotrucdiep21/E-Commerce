import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../model/product.model.js";
export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({});
        res.status(200).json({ allProducts });
    } catch (error) {
        console.log("Error getting products ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featuredProducts");

        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        //if nt in redis fetch to db
        //.lean() - gonna return a plain js object insrtead of mongoose document => which is good for performance
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "Featured products not found" });
        }
        //stored in the redis for quick access
        await redis.set("featuredProducts", JSON.stringify(featuredProducts), { EX: 60 * 60 });
        res.status(200).json(featuredProducts);

    } catch (error) {
        console.log("Error getting featured products ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        if (!name || !description || !price || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products"
            })
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url || "",
            category
        })

        res.status(201).json({ product, message: "Product created successfully" });

    } catch (error) {
        console.log("Error creating product ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; //get id of the image
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log("Image deleted from cloudinary");
            } catch (error) {
                console.log("Error deleting image from cloudinary", error.message);
            }
        }

        await product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error deleting product ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getRecommendatedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            $sample({
                size: 4
            }),
            {
                _id: 1,
                name: 1,
                description: 1,
                price: 1,
                image: 1
            }
        ])

        res.json({ products });
    } catch (error) {
        console.log("Error getting recommendated products ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error getting products by category ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            //update redis
            await updateFeaturedProductsCache();

            res.status(200).json(updatedProduct);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error toggling featured product ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateFeaturedProductsCache() {
    try {
        //the lean method returns a plain js object instead of mongoose document. This can be used for performance
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error updating featured products cache ", error.message);
    }
}