import { redis } from "../lib/redis.js";
import Product from "../model/product.model.js";
export const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({});
        res.status(200).json({allProducts});
    } catch (error) {
        console.log("Error getting products ", error.message);
        res.status(500).json({error: error.message});
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
        featuredProducts = await Product.find({isFeatured: true}).lean();

        if (!featuredProducts) {
            return res.status(404).json({message: "Featured products not found"});
        }
        //stored in the redis for quick access
        await redis.set("featuredProducts", JSON.stringify(featuredProducts), {EX: 60 * 60});
        res.status(200).json(featuredProducts);

    } catch (error) {
        console.log("Error getting featured products ", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}