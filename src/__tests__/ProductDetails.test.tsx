
import React = require("react");
import ProductDetails from "../components/ProductDetails";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { getDoc, getDocs, collection, query } from "firebase/firestore";

// Mocking React Router's useParams and useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }), // Mock product ID from router
    useNavigate: () => jest.fn(),
}));

// Mocking Firestore functions
jest.mock('firebase/firestore', () => {
    const actual = jest.requireActual('firebase/firestore');
    return {
        ...actual,
        getDoc: jest.fn(),
        getDocs: jest.fn(),
        collection: jest.fn(),
        query: jest.fn(),
    };
});

// Create mock product list
const mockProducts = [
    {id: "1", title: "Test Product 1", price: 10.0, description: "A great product!", image: "https://example.com/product1.jpg", category: 'electronics'},
    {id: "2", title: "Test Product 2", price: 20.0, description: "Another great product!", image: "https://example.com/product2.jpg", category: 'electronics'},
];

describe("Product Details Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Render the component, passing product id = 1.
    const renderComponent = () => {
        return render(
                <MemoryRouter initialEntries={["/product-detail/1"]}>
                    <Routes>
                        <Route path="/product-detail/:id" element={<ProductDetails />} />
                    </Routes>
                </MemoryRouter>                
        );
    };

    // Testing that product details page renders correctly with a test product
    test("renders product details page with a product", async() => {
        (getDocs as jest.Mock).mockResolvedValue({
            docs: mockProducts.map((product) => ({
                id: product.id,
                data: () => product,
            })),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument(); 
            expect(screen.getByText(/\$10.00/i)).toBeInTheDocument();
            expect(screen.getByText(/A great product!/i)).toBeInTheDocument();
            expect(screen.getByAltText(/Test Product 1 Image/i)).toBeInTheDocument();
        });
    });

    // Testing that product details page renders correctly with no product
    test("renders product details page with no product", async() => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Unknown Product/i)).toBeInTheDocument(); 
            expect(screen.getByText(/\$0.00/i)).toBeInTheDocument();
            expect(screen.getByText(/No description available./i)).toBeInTheDocument();
            expect(screen.getByAltText(/Unknown Product Image/i)).toBeInTheDocument();
        });
    });
});