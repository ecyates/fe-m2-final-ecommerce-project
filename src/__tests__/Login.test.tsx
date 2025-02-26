import React = require("react");
import Login from "../components/Login";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { act } from "react";
import { useAuth } from "../context/AuthContext";
import { setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Mock React Router Dom useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

// Mock Firebase Auth and Functions
jest.mock("firebase/auth", () => {
    const actualAuth = jest.requireActual("firebase/auth");
    return {
        ...actualAuth,
        getAuth: jest.fn(() => ({})),
        signInWithEmailAndPassword: jest.fn(() => 
            Promise.resolve({ user: { uid: "9w9o6dc27uOfVt989cOgoKjVNGc2" } })
        ),
        createUserWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    };
});

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

// Mock useAuth
jest.mock('../context/AuthContext', ()=>({
    useAuth: jest.fn(),
}));

// Describing the Component for signing in/out and registering
describe("Login Component", () => {
    beforeEach(() => {
        window.alert = jest.fn();
    });

    // simulate no user being signed in
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false, error: null });

    // Checking if the component renders correctly
    test("renders login form", () => {
        render(<MemoryRouter>
                <Login />
            </MemoryRouter>);
        
        expect(screen.getByText(/Sign in or Sign up Now/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Your Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Your Password/i)).toBeInTheDocument();    
    });

    // Simulating filling out the form and clicking log in
    test("calls signInWithEmailAndPassword on login", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    
        fireEvent.change(screen.getByPlaceholderText(/Enter Your Email/i), { target: { value: "hola.lizbeth@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Your Password/i), { target: { value: "Password1!" } });
    
        await act(async () => {
            fireEvent.click(screen.getByText(/Login/i));
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "hola.lizbeth@gmail.com", "Password1!");
    });

    // Simulating filling out and clicking register
    test('calls createUserWithEmailAndPassword on register', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter Your Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter Your Password/i), { target: { value: 'password123' } });

        await act(async()=>{
            fireEvent.click(screen.getByText(/Register/i));
        })

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    });

    // Simulating clicking the sign out button
    test('calls signOut on logout', async () => {
        // simulate a user being signed in
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: '9w9o6dc27uOfVt989cOgoKjVNGc2' }, loading: false, error: null });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await act(async()=>{
            fireEvent.click(screen.getByText(/Sign Out/i));
        });

        expect(signOut).toHaveBeenCalled();
    });
});