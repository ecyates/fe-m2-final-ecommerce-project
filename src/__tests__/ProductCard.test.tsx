import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productsSlice";
import ProductCard from "../components/Products/ProductCard";
import { MemoryRouter } from "react-router-dom";

// Create a mock Redux store
const mockStore = configureStore({
    reducer: { products: productReducer },
    preloadedState: {
        products: {
            items: [
                {
                    id: "1",
                    title: "Test Product 1",
                    price: 10.0,
                    description: "A great product!",
                    image: "https://example.com/product1.jpg",
                    category: 'electronics',
                },
            ],
            status: "succeeded",
            error: null,
        },
    },
});

describe("ProductCard Component", () => {
    // Test that the Product Card renders correctly
    it("renders product details correctly", () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ProductCard productId="1" />
                </MemoryRouter>
            </Provider>
        );

        // Check if the product title, price, and description are rendered
        expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument();
        expect(screen.getByText(/\$10.00/i)).toBeInTheDocument();
        expect(screen.getByText(/A great product!/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Test Product 1 Image/i)).toBeInTheDocument();
    });
});