import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice';
import productsReducer from '../features/productsSlice';
import { MemoryRouter } from 'react-router-dom';
import ShoppingCart from '../components/Cart/ShoppingCart';
import { AuthContext } from '../context/AuthContext';

// Create a mock Redux store
const mockStore = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
    },
    preloadedState: {
        cart: {
            products: { '1': 2 }, // Cart initially has 2 items of product 1
            totalItems: 2,
            totalPrice: 20,
        },
        products: {
            items: [
                { id: '1', title: 'Test Product 1', price: 10, image: 'image1.jpg', description: 'Test description', category: 'electronics' },
                { id: '2', title: 'Test Product 2', price: 20, image: 'image2.jpg', description: 'Test description', category: 'electronics' },
            ],
        },
    },
});

describe('ShoppingCart with Redux', () => {
    // Test that the shopping cart adds an item to the cart when the + button is clicked
    test('adds an item to the cart', async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <AuthContext.Provider value={{ user: { uid: 'test-user' } }}>
                        <ShoppingCart />
                    </AuthContext.Provider>
                </MemoryRouter>
            </Provider>
        );

        // Wait for product to appear 
        await waitFor(() => screen.getByText('Test Product 1'));

        // Click the add item button 
        const addButton = screen.getAllByText('+')[0];
        fireEvent.click(addButton);

        // Wait for Redux state update
        await waitFor(() => {
            // Get updated state from Redux store
            const state = mockStore.getState().cart;
            expect(state.products['1']).toBe(3); // Quantity should now be 3
            expect(state.totalItems).toBe(3);
        });
    });

    // Test that the shopping cart removes an item to the cart when the - button is clicked
    test('removes an item from the cart', async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <AuthContext.Provider value={{ user: { uid: 'test-user' } }}>
                        <ShoppingCart />
                    </AuthContext.Provider>
                </MemoryRouter>
            </Provider>
        );

        // Wait for product to appear
        await waitFor(() => screen.getByText('Test Product 1'));

        // Click the remove item button 
        const deleteButton = screen.getAllByText('-')[0];
        fireEvent.click(deleteButton);
        fireEvent.click(deleteButton);

        // Wait for Redux state update
        await waitFor(() => {
            // Get updated state from Redux store
            const state = mockStore.getState().cart;
            expect(state.products['1']).toBe(1); // Quantity should now be 1
            expect(state.totalItems).toBe(1);
        });
    });
});