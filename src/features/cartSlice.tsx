// cartSlice.tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCartFromSession } from "../utilities/sessionStorageUtilities";
import { Cart } from "../utilities/objectUtilities";
import { saveOrderToFirestore } from "./ordersSlice";
import { Timestamp } from "firebase/firestore";

const initialState:Cart = loadCartFromSession() || {
    products:{}, 
    totalItems:0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<any>) => {
            const {id, price} = action.payload;
            if (state.products[id]) {
                state.products[id] += 1;
            }else{
                state.products[id] = 1;
            }
            state.totalItems+=1;
            state.totalPrice += price; // Calculate total price
        },
        removeItem: (state, action:PayloadAction<any>) => {
            const {id, price} = action.payload;
            if (state.products[id]){
                state.products[id] -= 1;
                if (state.products[id]===0){
                    delete state.products[id];
                }
                state.totalItems -= 1;
                state.totalPrice -= price; // Calculate total price
            }
        },
        checkout: (state) => {
            // Reset the cart after checkout
            state.products = {};
            state.totalItems = 0;
            state.totalPrice = 0;

        },
    },
});

export const { addItem, removeItem, checkout } = cartSlice.actions;
export default cartSlice.reducer;