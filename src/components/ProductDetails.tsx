import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { getDocs, collection, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Product, Cart } from '../utilities/objectUtilities';


const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useAuth();
    const [cart, setCart] = useState<Cart>({products:{}, totalItems:0});
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product>({ title: 'Unknown Product', description: '', category: '', price: 0, image: ''});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(()=>{
        const fetchData = async () => {
            try{
                setIsLoading(true);
                const querySnapshot = await getDocs(collection(db, 'products'));
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];
                setProducts(dataArray);

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
                setError('');
            }catch(error){
                setError(`Error loading content: ${error}`)
            }
        }
        if (id){
            let tempProduct = products.find(product=>product.id===id);
            if(tempProduct) setProduct(tempProduct);
        }
        fetchData();
        setIsLoading(false);
    },[products, id]);

    const deleteProduct = async(id:any)=>{
        try{
            await deleteDoc(doc(db, 'products', id));
            setIsLoading(true);
            setError('');
            navigate(0);
        }catch(error){
            setError(`Error deleting product:  ${error}`);
        }
    }

    const handleAddToCart = async (id: any) => {
        try {
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
            alert('Product added to cart.');
            setIsLoading(true);
            setError('');
            navigate(0);
        }catch(error){
            setError(`Error adding product:  ${error}`);
        }
    };

    return (
        <Container className="product-detail p-3 rounded mt-3 text-center">
            <div className='text-center'>
                {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
                {error&&<Alert variant='danger'>{error}</Alert>}
            </div>
            <img
                src={product.image || 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                className="card-img-top rounded"
                alt={`${product.title} Image`}
                style={{height:'300px', width:'auto'}}
            />
            <h1>{product.title}</h1>
            <p className='lead'>Price: ${product.price.toFixed(2)}</p>
            <p className="mt-3">{product.description || 'No description available.'}</p>
            <div>
                {product.title !=='Unknown Product' && <Button variant="primary" className="mx-2" onClick={() => handleAddToCart(id)}>Add to Cart</Button>}
                <Button onClick={()=>navigate('/home/')} className="mx-2 btn btn-secondary">Keep Shopping</Button>
            </div>
            {user&&<div className='mt-3'><Button variant='danger' onClick={()=>deleteProduct(product.id)}>Delete Product</Button></div>}
        </Container>
    );    
};

export default ProductDetails;