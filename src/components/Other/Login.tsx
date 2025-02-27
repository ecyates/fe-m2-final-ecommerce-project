// Login.tsx
import React from "react";
import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    // Function to validate the password
    const validatePassword = (password: string) => {
        const minLength = /.{8,}/; // At least 8 characters
        const uppercase = /[A-Z]/; // At least one uppercase letter
        const lowercase = /[a-z]/; // At least one lowercase letter
        const number = /[0-9]/; // At least one number
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character
    
        if (
            !minLength.test(password) ||
            !uppercase.test(password) ||
            !lowercase.test(password) ||
            !number.test(password) ||
            !specialChar.test(password)
        ) {
            return "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
        }
        return null; // No errors
    };
    
    // Function to handle registering a new user
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Register function called");  // Add this line to verify it's being triggered
        // Validate the password and return error if applicable
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setEmail('');
            setPassword('');
            return;
        }
        
        // If no error with password, create user with Firebase
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name: '',
                email: user.email,
                phone: '',
                address: '',
            });
            alert('Registration successful!');
            navigate(`/edit-user/${user.uid}`); // Navigate to set up the user profile
        } catch (error: any) {
            setError('Error registering: '+error.message);
            setEmail('');
            setPassword('');
        }
    };

    // Function to handle logging in
    const handleLogin = async(e:FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            navigate('/home/');
        }catch(error:any){
            setError('Error logging in: '+error.message);
            setEmail('');
            setPassword('');
        }
    };

    // Function to handle logging out
    const handleLogout = async (e:FormEvent) => {
        e.preventDefault();
        try{
            await signOut(auth);
            alert('Successfully logged out!');
            navigate('/home/');
        }catch(error:any){
            setError('Error logging out: '+error.message);
            setEmail('');
            setPassword('');
        }
    }
    
    return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loginForm mt-5 p-5 rounded text-center shadow-lg">
            {loading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
            {error&&<Alert variant='danger'>{error}</Alert>}
            {user?(
                <>
                <h1>Already Signed In</h1>
                <p className='lead'>You are currently signed in as {user.email}.</p>
                <Button className="btn btn-primary mb-3" onClick={handleLogout}>Sign Out</Button>
                </>
            ):(
            <>
            <h1>Sign in or Sign up Now</h1>
            <Form onSubmit={handleLogin} className="w-100">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClick={()=>setError('')}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClick={()=>setError('')}
                    />
                </Form.Group>
                <Form.Group className="mb-3 text-center">
                    <Button type="submit" className="mx-3">Login</Button>
                    <Button className="btn btn-secondary mx-3" onClick={handleRegister}>Register</Button>
                </Form.Group>
            </Form>
            </>)}
        </div>
    </Container>
    );
};

export default Login;