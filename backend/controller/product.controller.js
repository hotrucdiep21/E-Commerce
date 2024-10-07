import Product from "../model/product.model.js";
export const getAllProducts = async (req, res) => {

    console.log("Get all products", req.body);
    try {
        const allProducts = await Product.find({});
        res.status(200).json({allProducts});
    } catch (error) {
        console.log("Error getting products ", error.message);
        res.status(500).json({error: error.message});
    }
}