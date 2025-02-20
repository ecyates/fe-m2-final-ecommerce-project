// ShoppingCart.tsx
import React from 'react';
import { Container, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDocs, collection, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from '../context/AuthContext';
import { Product, Cart } from '../utilities/objectUtilities';
import { useNavigate } from 'react-router-dom';

const ShoppingCart: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Cart>({products:{}, totalItems: 0});
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const getProduct = (id:string) => {
        const product = products.find((product)=>product.id===id);
        return product || { title: 'Unknown Product', description: '', category: '', price: 0, image: ''};
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch all products
                const querySnapshot = await getDocs(collection(db, 'products'));
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];
                setProducts(dataArray);
                console.log(products);
    
                // Fetch user cart only if userId exists
                if (user) {
                    const cartRef = doc(db, 'cart', user.uid);
                    const cartSnap = await getDoc(cartRef);
                    if (cartSnap.exists()) {
                        setCart(cartSnap.data() as Cart);
                    }
                }else{
                    const guestCart = localStorage.getItem('guest-cart');
                    setCart(guestCart ? JSON.parse(guestCart) : { products: {}, totalItems: 0 });
                }
                setIsLoading(false);
                setError('');
            } catch (error) {
                setError(`Error loading content: ${error}`)
            }
        };
    
        fetchData();
    }, [user]); // Runs when the userId changes
    
    useEffect(() => {
        let amount = 0;
        Object.entries(cart.products || {}).forEach(([id, quantity]) => {
            const product = products.find((p) => p.id === id);
            if (product) {
                amount += quantity * product.price;
            }
        });
        setTotalAmount(amount);
    }, [cart, products]); // Runs when cart or products change

    const handleAddItem = async (id: any) => {
        try{
            let updatedCart = {...cart};
            updatedCart.products[id] = (updatedCart.products[id] || 0) + 1;
            updatedCart.totalItems++;
        
            if (user){
                const cartRef = doc(db, 'cart', user.uid);
                await setDoc(cartRef, updatedCart);
            }else {
                // Guest update (localStorage)
                localStorage.setItem("guest-cart", JSON.stringify(updatedCart));
            }
            setCart(updatedCart);
            setError('');
            navigate(0);
        }catch(error){
            setError(`Error adding product: ${error}`)
        }
    };    

    const handleRemoveItem = async (id: any) => {
        if (!cart.products[id]) return;
    
        try{
            let updatedCart = { ...cart };
            updatedCart.products[id]--;
        
            if (updatedCart.products[id] === 0) {
                delete updatedCart.products[id];
            }
        
            updatedCart.totalItems--;
        
            if (user) {
                const cartRef = doc(db, 'cart', user.uid);
                await setDoc(cartRef, updatedCart);
            } else {
                localStorage.setItem("guest-cart", JSON.stringify(updatedCart));
            }
            setError('');
            setCart(updatedCart);
            navigate(0);
        }catch(error){
            setError(`Error deleting product: ${error}`);
        }
    };
    
    const handleCheckout = async () => {
        let emptyCart = { products: {}, totalItems: 0 };
        try {
            if (user){
                const cartRef = doc(db, 'cart', user.uid);
                await setDoc(cartRef, emptyCart);
            }else{
                localStorage.removeItem("guest-cart");
            }
            setCart(emptyCart);
            setError('');
            navigate(0);
        }catch(error){
            setError(`Error emptying cart: ${error}`)
        }
    };

    return(
        <Container className="mt-5 shopping-bag p-5 rounded shadow-lg">
            <h1 className='text-center mb-3'>Shopping Bag</h1>
            <div className='text-center'>
                {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
                {error&&<Alert variant='danger'>{error}</Alert>}
            </div>
            {Object.entries(cart.products).length===0?(
                <div className='text-center'>
                <div className='lead mb-3'>Your shopping bag is currently empty...</div>
                <Link to="/home"><Button className="ms-2 btn btn-secondary">Keep Shopping</Button></Link>
                </div>):(
                <><Table striped hover className="rounded">
                <tbody>
                {Object.entries(cart.products).map(([id, quantity]) => (
                    <tr key={id} className='align-middle'>
                        <td><img 
                            src={getProduct(id).image} 
                            alt={getProduct(id).title} 
                            style={{width:'50px', marginRight:'10px'}}/></td>
                        <td><a href={`/product-detail/${id}`}>{getProduct(id).title}</a></td> 
                        <td>${getProduct(id).price.toFixed(2)}</td>
                        <td>
                        <Table bordered style={{width:'100px'}} className='m-0'>
                            <tbody>
                            <tr>
                                <td><button className='customButton' onClick={() => handleRemoveItem(id)}>-</button></td>
                                <td>{quantity}</td>
                                <td><button className='customButton' onClick={() => handleAddItem(id)}>+</button></td>
                            </tr>
                            </tbody>
                        </Table>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className='text-end'>Totals:</td>
                    <td className='text-center'>${totalAmount.toFixed(2)}</td>
                    <td className='text-center'>{cart.totalItems} items</td>
                </tr>
                <tr>

                </tr>
                </tbody>
            </Table>
            
            <div className='text-end'>
            <Button className='btn btn-primary' onClick={()=>{handleCheckout()}}>Check Out</Button>
            <Link to="/home"><Button className="ms-2 btn btn-secondary">Keep Shopping</Button></Link>
            </div>
            </>
            )}
        </Container>
    );
};

export default ShoppingCart;