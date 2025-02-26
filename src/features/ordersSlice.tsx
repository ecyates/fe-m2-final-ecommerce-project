import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { RootState } from "../store";
import { Order } from "../utilities/objectUtilities";
import { db } from "../firebaseConfig";

interface OrdersState {
    orders: Order[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    status: "idle",
    error: null,
};

// Async function to save order to Firestore
export const saveOrderToFirestore = createAsyncThunk(
    "orders/saveOrderToFirestore",
    async (order: Order, { rejectWithValue }) => {
        try {
            const orderRef = doc(db, "orders", order.userId + "_" + order.date);
            await setDoc(orderRef, order);
            return order; // Return order for local state update
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveOrderToFirestore.pending, (state) => {
                state.status = "loading";
            })
            .addCase(saveOrderToFirestore.fulfilled, (state, action: PayloadAction<Order>) => {
                state.orders.push(action.payload);
                state.status = "succeeded";
            })
            .addCase(saveOrderToFirestore.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;
