import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../utilities/objectUtilities";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            if (querySnapshot.empty) {
                throw new Error('No products found.');
            }
            const products = querySnapshot.docs.map((doc) => ({
                id: String(doc.id),
                ...doc.data(),
            })) as Product[];
            return products;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch products.');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState, 
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.items = action.payload.map((product: any) => ({
                    id: String(product.id),  
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    image: product.image,
                }));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'An error occurred';
            });
    }
});

export default productsSlice.reducer;


        // const response = await fetch('https://fakestoreapi.com/products');
        // if (!response.ok){
        //     throw new Error('Failed to fetch products.')
        // }
        // const products = await response.json();
        // return products;