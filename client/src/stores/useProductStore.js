import {create} from 'zustand';
import axios from '../libs/Axios';
import toast from 'react-hot-toast';

export const useProductStore = create(set=>({
    products : [],
    loading : false,


    setProducts : (products)=>set({products}),

    createProduct : async (productData)=>{
        set({loading : true});
        try {
            const res = await axios.post("/products",productData);
            set(prevState=>({
                products : [...prevState.products,res.data.product],
                loading : false
            }))
            toast.success(res.data.message)
        } catch (error) {
            toast(error.response.data.error || "failed to fetch");
            set({loading : false});
        }
    },

    fetchAllProducts : async()=>{
        set({loading : true});

        try {
            const res =await axios.get("/products");
            set({products : res.data.products,loading:false})
        } catch (error) {
            toast(error.response.data.error);
            set({loding : false})
        }
    },

    deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
    toggleFeaturedProduct : async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.updatedProduct.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	}
}))