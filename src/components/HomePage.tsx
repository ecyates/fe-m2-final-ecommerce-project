import { Container, Button, Spinner, Alert } from "react-bootstrap";
import ProductCatalog from "./Products/ProductCatalog";
import { useState, useEffect } from "react";
import { faChevronCircleRight, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { User } from "../utilities/objectUtilities";

function HomePage(){
    const { user, loading, error } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<User|null>(null);
    // Storing the showCatalog variable in local storage
    const [showCatalog, setShowCatalog] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("showCatalog");
        return storedValue ? JSON.parse(storedValue) : false;
    });

    // Fetching the name of the user when a user signs in/out
    useEffect(()=>{
        const fetchUser = async (uid) => {
            try {
                const userRef = doc(db, 'users', uid);
                const userSnap = await getDoc(userRef);
        
                if (userSnap.exists()) {
                    setUserData({ id: userSnap.id, ...userSnap.data() } as User);
                } 
            } catch (error) {
                console.log(`Error loading content: ${error}`);
            } 
        }

        if (user){
            fetchUser(user.uid);
        }
    }, [user])

    // Update localStorage whenever `showCatalog` changes
    useEffect(() => {
        localStorage.setItem("showCatalog", JSON.stringify(showCatalog));
    }, [showCatalog]);

    // Function to handle signing out
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
                    🛍️ Welcome{user && userData && `, ${(userData.name?userData.name:user.email)},`} to the Ultimate Shopping Adventure! 🎉
                </h1>
                <p className="lead">
                    Explore thousands of products curated just for you. Find your favorites, snag the best deals, and make your shopping dreams come true!
                </p>
                <p> {/*Personalized message if the user is signed in */}
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
            <>  {/* Toggle the Product Catalog and hide the welcome message */}
                <div className='text-center my-3'><Button onClick={()=>setShowCatalog(!showCatalog)}>Hide Catalog</Button></div>
                <ProductCatalog/>
            </>
            }
        </>

    );
};

export default HomePage;