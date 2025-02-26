// OrdersList.tsx
import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { Order } from '../../utilities/objectUtilities';
import { Link } from 'react-router-dom';
import { query, where } from 'firebase/firestore';


const OrdersList = ({ userId }: { userId: string }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // deleteUser Function
    const deleteOrder = async (orderId: string) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        } catch (error: any) {
            setError(`Error deleting order: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                setIsLoading(true);
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, where("userId", "==", userId)); // Filter orders by userId
                const querySnapshot = await getDocs(q);
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Order[];
                setOrders(dataArray);
                setError('');
                setIsLoading(false);
            } catch (error: any) {
                setError(`Error loading content: ${error.message}`);
            }
        };
        fetchData();
    }, [userId]);

    return (
        <span>
        {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
        {error&&<Alert variant='danger'>{error}</Alert>}
            {orders.length !== 0 &&  
            <>
                <div className='text-center mt-3'><b>Orders</b></div>
                <ul>
                {orders.map(order=>(<li key={order.id || Math.random()} className='mb-3'>
                    <Link to={`/order-details/${order.id}`} >
                        {new Date(order.date).toLocaleDateString()}
                    </Link> 
                    <Button className='btn btn-danger mx-3' onClick={()=>deleteOrder(order.id)}>
                    X
                    </Button>
                    </li>
                ))}
                </ul>
            </>}
        </span>
    );
};

export default OrdersList;