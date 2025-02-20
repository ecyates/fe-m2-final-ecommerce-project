import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShoppingCart from '../components/ShoppingCart';
import { AuthContext } from '../context/AuthContext';
import { getDocs, getDoc, setDoc } from 'firebase/firestore';

// Mock React Router Dom's useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

// Mock Firestore functions
jest.mock('firebase/firestore', () => {
    const actual = jest.requireActual('firebase/firestore');
    return {
        ...actual,
        getDocs: jest.fn(),
        getDoc: jest.fn(),
        setDoc: jest.fn(),
    };
});

// Mock user, product list and cart
const mockUser = { uid: 'test-user' };
const mockProducts = [
    { id: '1', title: 'Test Product 1', price: 10, image: 'image1.jpg', description: 'Test description', category: 'electronics' },
    { id: '2', title: 'Test Product 2', price: 20, image: 'image2.jpg', description: 'Test description', category: 'electronics' },
];
const mockCart = { products: { '1': 2 }, totalItems: 2 };

describe('ShoppingCart Integration Tests', () => {
    // Start fresh before each
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Render component function with mock user
    const renderComponent = (user = mockUser) => {
        return render(
            <AuthContext.Provider value={{ user }}>
                <BrowserRouter>
                    <ShoppingCart />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    // Checks that it renders correctly
    test('renders ShoppingCart component', async () => {
        // Set up mock product list and cart
        (getDocs as jest.Mock).mockResolvedValue({
            docs: mockProducts.map((product) => ({
                id: product.id,
                data: () => product,
            })),
        });
        (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => mockCart });

        renderComponent();

        expect(screen.getByText('Shopping Bag')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('$10.00')).toBeInTheDocument();
            expect(screen.getByText('2 items')).toBeInTheDocument();
        });
    });

    // Checks that it adds an item to the cart
    test('adds an item to the cart', async () => {
        // Set up mock product list and cart
        (getDocs as jest.Mock).mockResolvedValue({
            docs: mockProducts.map((product) => ({
                id: product.id,
                data: () => product,
            })),
        });
        (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => mockCart });

        renderComponent();

        await waitFor(() => screen.getByText('Test Product 1'));

        // Click the add item button 
        const addButton = screen.getAllByText('+')[0];
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalled();
        });
    });

    test('removes an item from the cart', async () => {
        (getDocs as jest.Mock).mockResolvedValue({
            docs: mockProducts.map((product) => ({
                id: product.id,
                data: () => product,
            })),
        });
        (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => mockCart });

        renderComponent();

        await waitFor(() => screen.getByText('Test Product 1'));

        const removeButton = screen.getAllByText('-')[0];
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalled();
        });
    });

    test('clears cart on checkout', async () => {
        (getDocs as jest.Mock).mockResolvedValue({
            docs: mockProducts.map((product) => ({
                id: product.id,
                data: () => product,
            })),
        });
        (getDoc as jest.Mock).mockResolvedValue({ exists: () => true, data: () => mockCart });

        renderComponent();

        await waitFor(() => screen.getByText('Test Product 1'));

        const checkoutButton = screen.getByText('Check Out');
        fireEvent.click(checkoutButton);

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
                products: {},
                totalItems: 0,
            });
        });
    });
});