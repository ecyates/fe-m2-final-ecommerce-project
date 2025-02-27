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
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function NavBar(){
    const navigate = useNavigate();
    const { user } = useAuth();
    const cartCount = useSelector((state:RootState)=>state.cart.totalItems);

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
                    <Nav.Link href="/users/">Users</Nav.Link>
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