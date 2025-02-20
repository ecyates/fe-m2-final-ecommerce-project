import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCartShopping, faHouse, faChevronCircleRight, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'; 
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Cart } from '../utilities/objectUtilities';
import { db } from '../firebaseConfig';

function NavBar(){
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(()=>{
        const fetchCartCount = async () =>{
            let cart = { products: {}, totalItems: 0 };
            // Fetch user cart only if user exists
            if (user) {
                const cartRef = doc(db, 'cart', user.uid);
                const cartSnap = await getDoc(cartRef);
                if (cartSnap.exists()) {
                    cart = (cartSnap.data() as Cart);
                }
            }else{
                const guestCart = localStorage.getItem('guest-cart');
                if (guestCart){
                    cart = JSON.parse(guestCart);
                }
            }
            setCartCount(cart.totalItems);
        }
        fetchCartCount();
    }, []);

    const handleLogout = async () =>{
        try {
            await signOut(auth);
            alert('Logged out!');
            navigate('/home/');
        }catch(error:any){
            console.error('Logout error:', error.message);
        }
    };
    return(
        <Navbar collapseOnSelect expand="lg">
            <Container>
                <Navbar.Brand href="/home"><FontAwesomeIcon icon={faBagShopping} />&nbsp;Let's Shop!</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/home"><FontAwesomeIcon icon={faHouse}/> Home</Nav.Link>
                </Nav>
                <Nav>
                <Nav.Link href='/view-cart'><FontAwesomeIcon icon={faCartShopping}/> Cart ({cartCount})</Nav.Link>
                {user?
                    <>
                    <Nav.Link href='/add-product/'> Add New Product</Nav.Link>
                    <Nav.Link href="/add-user/">Users</Nav.Link>
                    <Nav.Link onClick={()=>handleLogout()}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out</Nav.Link>
                    </>
                    :<Nav.Link onClick={()=>navigate('/login/')}><FontAwesomeIcon icon={faChevronCircleRight}/> Sign In | Register</Nav.Link>
                }
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        )
}

export default NavBar;