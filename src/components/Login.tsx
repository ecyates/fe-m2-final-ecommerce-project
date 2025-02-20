// Login.tsx
import React from "react";
import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async(e:FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            navigate('/home/');
        }catch(err:any){
            setError(err.message);
        }
    };

    const handleRegister = async (e:FormEvent)=>{
        e.preventDefault();
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
            navigate('/home/');
        }catch(err:any){
            setError(err.message);
        }
    };

    const handleLogout = async (e:FormEvent) => {
        e.preventDefault();
        try{
            await signOut(auth);
            alert('Successfully logged out!');
            navigate('/home/');
        }catch(err:any){
            setError(err.message);
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
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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