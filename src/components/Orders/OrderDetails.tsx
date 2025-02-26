import React from "react";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Container, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Order, Product, User } from '../../utilities/objectUtilities';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import { fetchProducts } from "../../features/productsSlice";
import { getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const OrderDetails: React.FC = () => {
    const { id } = useParams();
    const products = useSelector((state:RootState)=>state.products.items);
    const productsLoading = useSelector((state:RootState)=>state.products.status);
    const productsError = useSelector((state:RootState)=>state.products.error);
    const [user, setUser] = useState<User>({name:'Guest Shopper', email:'', phone:'', address:''});
    const [order, setOrder] = useState<Order>({ userId: '', products: {}, totalItems: 0, totalPrice: 0, date: ''});
    const [orderLoading, setOrderLoading] = useState<boolean>(true);
    const [orderError, setOrderError] = useState<string>('')
    const [orderProducts, setOrderProducts] = useState<Product[]>([]);;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Fetch Order based on ID and Products List on set up and updates
    useEffect(()=>{
        const fetchOrder = async (id:string) =>{
            try {
                setOrderLoading(true);
                const orderRef = doc(db, 'orders', id);
                const orderSnap = await getDoc(orderRef);
        
                if (orderSnap.exists()) {
                    setOrder({ id: orderSnap.id, ...orderSnap.data() } as Order);
                    setOrderError('');
                } else {
                    setOrderError('Order not found.');
                }
            } catch (error) {
                setOrderError(`Error loading order: ${error.message}`);
            } finally {
                setOrderLoading(false);
            }
        }
        if(id) fetchOrder(id);

        if(productsLoading === 'idle'){
            dispatch(fetchProducts());
        }
    },[dispatch, id, productsLoading]);

    // Fetch the products in the order and the corresponding user data when the order and product list are ready
    useEffect(() => {
        // Get products in the order from the products list
        const getProducts = (id:string) => {
            const product = products.find((product)=>product.id===id);
            return product || { title: 'Unknown Product', description: '', category: '', price: 0, image: ''};
        }

        // Get the user data from the user ID
        const getUser = async (userId:string) => {
            try {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
        
                if (userSnap.exists()) {
                    setUser({ id: userSnap.id, ...userSnap.data() } as User);
                }
            } catch (error) {
                setUser({name:'Guest Shopper', email:'', phone:'', address:''});
            } 
        }

        if (order && Object.keys(order.products).length > 0) {
            setOrderProducts(Object.entries(order.products).map(([id]) => getProducts(id)));
            getUser(order.userId);
        }
    }, [order, products]);

    // Function to delete the order and return to the users page
    const deleteOrder = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'orders', id));
            navigate('/users/');
        } catch (error) {
            setOrderError('Error deleting order: '+error.message);
        }
    };

    return (
        <Container className="mt-5 shopping-bag p-5 rounded shadow-lg">
            <div className='text-center mb-3'>
                {/* Display Order Id as a Badge */}
            {order.date&&<h5 className='text-end'><Badge className='badge-pill bg-info'>{order.id}</Badge></h5>}
            <h1>Order Details</h1>
                {orderLoading||productsLoading==='loading'&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
                {orderError||productsError&&<Alert variant='danger'>{orderError||productsError}</Alert>}
            </div>
            {order.date&&
            <>
            <p className='lead'><b>User:</b> {user.name}</p>
            <p className='lead'><b>Date:</b> {new Date(order.date).toLocaleDateString()}</p>
            <Table striped hover className="rounded">
                <tbody>
                {orderProducts.map((product) => (
                    <tr key={product.id || Math.random()} className='align-middle'>
                        <td><img 
                            src={product.image|| 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                            alt={product.title} 
                            style={{width:'50px', marginRight:'10px'}}/></td>
                        <td><Link to={`/product-detail/${product.id}`}>{product.title}</Link></td> 
                        <td >${product.price.toFixed(2)}</td>
                        <td>Qty: {order.products[product.id]}</td>
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td className='text-end'>Totals:</td>
                    <td >${order.totalPrice.toFixed(2)}</td>
                    <td >&nbsp;{order.totalItems} items</td>
                </tr>
                </tbody>
            </Table></>
            }
            <div className='mt-3 text-center'>
            {order.date&&<Button className='m-2' variant='danger' onClick={()=>deleteOrder(id)}>Delete Order</Button>}
            <Button className='m-2' variant='secondary' onClick={()=>navigate('/users/')}>Back</Button>
            </div>
            
        </Container>
    );    
};

export default OrderDetails;