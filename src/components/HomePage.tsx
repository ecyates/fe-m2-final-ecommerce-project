import { Container, Button, Spinner, Alert } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import { useState, useEffect } from "react";
import { faChevronCircleRight, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

function HomePage(){
    const { user, loading, error } = useAuth();
    const navigate = useNavigate();

    const [showCatalog, setShowCatalog] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("showCatalog");
        return storedValue ? JSON.parse(storedValue) : false;
    });

    // Update localStorage whenever `showCatalog` changes
    useEffect(() => {
        localStorage.setItem("showCatalog", JSON.stringify(showCatalog));
    }, [showCatalog]);

    const handleLogout = async () =>{
        try {
            await signOut(auth);
            alert('Successfully logged out!');
            navigate('/home/');
        }catch(error:any){
            console.error('Logout error:', error.message);
        }
    };

    if(loading)return(<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>);
    if(error)return(<Alert variant='danger'>{error}</Alert>);

    return (
        <>
            
            {!showCatalog?
            <Container className="my-5 p-3 rounded welcome-message">
                <h1 className="mb-3 text-center">
                    🛍️ Welcome{user && `, ${user?.email},`} to the Ultimate Shopping Adventure! 🎉
                </h1>
                <p className="lead">
                    Explore thousands of products curated just for you. Find your favorites, snag the best deals, and make your shopping dreams come true!
                </p>
            <p>
                {user
                    ? "Ready to pick up where you left off? Your cart is waiting!"
                    : "Sign in now for a personalized experience and exclusive deals."}
            </p>            
            <div className='text-center mb-3'><Button onClick={()=>setShowCatalog(!showCatalog)}>Show Catalog</Button>&nbsp;
            {!user? (
            <Button variant='secondary' onClick={()=>navigate('/login/')}><FontAwesomeIcon icon={faChevronCircleRight}/> Sign In | Register</Button>
            ): (
            <Button variant='secondary' onClick={()=>handleLogout()}><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign Out</Button>
            )}
            </div>
            </Container>:
            <>
            <div className='text-center my-3'><Button onClick={()=>setShowCatalog(!showCatalog)}>Hide Catalog</Button></div>
            <ProductCatalog/>
            </>
            }
        </>

    );
};

export default HomePage;