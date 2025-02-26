// ShoppingCart.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { RootState, AppDispatch } from '../../store';
import { Product } from '../../utilities/objectUtilities';
import { addItem, removeItem, checkout } from '../../features/cartSlice';
import { fetchProducts } from '../../features/productsSlice';
import { saveOrderToFirestore } from '../../features/ordersSlice';

const ShoppingCart: React.FC = () => {
    const products = useSelector((state:RootState)=>state.products.items);
    const isLoading = useSelector((state:RootState)=>state.products.status);
    const error = useSelector((state:RootState)=>state.products.error);
    const cart = useSelector((state:RootState)=>state.cart);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);;
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    // Fetch products and set cart whenever the products or cart are updated or dispatch is used
    useEffect(()=>{
        const getProducts = (id:string) => {
            const product = products.find((product)=>product.id===id);
            return product || { title: 'Unknown Product', description: '', category: '', price: 0, image: ''};
        }
        if(isLoading === 'idle'){
            dispatch(fetchProducts());
        }        
        setCartProducts((Object.entries(cart.products).map(([id])=>getProducts(id))));
    },[products, cart, dispatch]);

    // Function to add item to cart
    const handleAddToCart = (id:string, price: number)=>{
        dispatch(addItem({id, price}));
    };

    // Function to remove item from cart
    const handleRemoveFromCart = (id:string, price: number)=>{
        dispatch(removeItem({id, price}));
    };

    // Function to handle checkout
    const handleCheckout = async (userId:string)=>{
        // Create an order based on the cart
        const order = {
            userId: userId || "guest", // use 'guest' if no user
            products: cart.products,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems,
            date: new Date().toISOString(), // Include date of when the order was placed
        };
        try{
            // Save order to Firestore
            await dispatch(saveOrderToFirestore(order));
            // Clear the cart
            dispatch(checkout());
            // Thank customer for purchase
            alert('Thank you for your purchase!');
        }catch(error){
            console.error(error);
        }
    };

    return(
        <Container className="mt-5 shopping-bag p-5 rounded shadow-lg">
            <h1 className='text-center mb-3'>Shopping Bag</h1>
            {error&&<Alert variant='danger'>{error}</Alert>}
            {isLoading==='loading'?
            <div className='text-center'>
                <Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>
            </div>:
            <> {/* Display if the cart is empty. */}
            {cartProducts.length===0 ?(
                <div className='text-center'>
                {isLoading==='succeeded'&&<><div className='lead mb-3'>Your shopping bag is currently empty...</div>
                <Link to="/home"><Button className="ms-2 btn btn-secondary">Keep Shopping</Button></Link></>}
                </div>):(
                <><Table striped hover className="rounded">
                <tbody>
                {cartProducts.map((product) => (
                    <tr key={product.id || Math.random()} className='align-middle'>
                        <td><img 
                            src={product.image|| 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                            alt={product.title} 
                            style={{width:'50px', marginRight:'10px'}}/></td>
                        <td><Link to={`/product-detail/${product.id}`}>{product.title}</Link></td> 
                        <td className='text-end'>${(product.price??0).toFixed(2)}</td>
                        <td >
                        <Table bordered style={{width:'100px'}} className='m-0'>
                            <tbody>
                            <tr>
                                <td><button className='customButton' onClick={() => handleRemoveFromCart(product.id, product.price)}>-</button></td>
                                <td>{cart.products[product.id]}</td>
                                <td><button className='customButton' onClick={() => handleAddToCart(product.id, product.price)}>+</button></td>
                            </tr>
                            </tbody>
                        </Table>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className='text-end'>Totals:</td>
                    <td className='text-end'>${(cart.totalPrice??0).toFixed(2)}</td>
                    <td className='text-start'>&nbsp;{cart.totalItems} items</td>
                </tr>
                </tbody>
            </Table>
            <div className='text-end'>
            {/* Buttons to check out or continue shopping. */}
            <Button className='btn btn-primary' onClick={()=>{handleCheckout(user?.uid || '')}}>Check Out</Button>
            <Link to="/home"><Button className="ms-2 btn btn-secondary">Keep Shopping</Button></Link>
            </div>
            </>)}</>}
        </Container>
    );
};

export default ShoppingCart;