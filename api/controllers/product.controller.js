import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"

export const getAllProducts = async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({products,message : 'fetched successfully'})
    } catch (error) {
        res.status(500).json({error : `while getting all products ${error.message}`})
    }
}


export const getFeaturedProducts = async (req,res)=>{
    try {
        let featuredProducts = await redis.get('featured_products');
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts))
        }

        //if not in redis, fetch from mongodb
        //.lean() is gonna return a plain js object instead of a mongodb document to increase performance
        featuredProducts = await Product.find({isFeatured : true}).lean();

        if(!featuredProducts){
            return res.status(404).json({error : "No featured product found"})
        }

        //store in redis from future quick access

        await redis.set('featured_products',JSON.stringify(featuredProducts))

        return res.status(200).json(featuredProducts);
    } catch (error) {
        res.status(500).json({error : "while getting featured Products : "+error.message})
    }
}

export const createProduct = async (req,res)=>{
    try {
        const {name, description, price, image, category} = req.body;
        let coludinaryResponse = null;

        if(image){
            coludinaryResponse = await cloudinary.uploader.upload(image,{folder : "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image : coludinaryResponse?.secure_url ? coludinaryResponse.secure_url : "",
            category
        })
        return res.status(201).json({product,message : "product created successfully"})
    } catch (error) {
        res.status(500).json({error : "while creating Product : "+error.message})
    }
}


export const deleteProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({error : "Product not found"})
        }

        if(product.image){
            let publicId = product.image.split("/").pop().split(".")[0]; //https://res.cloudinary.com/de7pjet7r/image/upload/v1727429744/vggjocrqtyg4azvpi2uj.jpg
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image fron cloudinary");
            } catch (error) {
                console.log(`error deleting image fron cloudinary ${error.message}`)
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({message : "product deleted successfully"})
    } catch (error) {
        res.status(500).json({error : "while deleting Product : "+error.message})
    }
}


export const getRecommendedProducts = async (req,res)=>{
    try {
        const products = await Product.aggregate([
            {
                $sample : {size : 3}
            },
            {
                $project : {
                    _id : 1,
                    name : 1,
                    description : 1,
                    image : 1,
                    price : 1
                }
            }
        ])

        res.status(200).json({products,message : "products fetched successfully"})
    } catch (error) {
        res.status(500).json({error : "while getting recommended Product : "+error.message})
    }
}

export const getProductsByCategory = async (req,res)=>{
    const {category} = req.params;
    try {
        const products = await Product.find({category})

        res.status(200).json({products,message : "products fetched successfully"})
    } catch (error) {
        res.status(500).json({error : "while getting Product By Category: "+error.message})
    }
}

export const toggleFeaturedProducts = async (req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updatedFeaturedProductsCache();
            res.status(200).json({updatedProduct,message : "products fetched successfully"})
        }else{
            res.status(404).json({error : "Product not found"})
        }
    } catch (error) {
        res.status(500).json({error : "while getting Product By Category: "+error.message})
    }
}

async function updatedFeaturedProductsCache(){
    try {
        //the lean() method is used to return plain js object instead of full mongoose documents. this can significantly improve performance
        const featuredProducts = await Product.find({isFeatured : true}).lean();
        await redis.set('featured_products',JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in updating cache function",error.message)
    }
}