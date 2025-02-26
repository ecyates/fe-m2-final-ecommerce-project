import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Product } from '../../utilities/objectUtilities';
import { addItem } from "../../features/cartSlice";
import { RootState } from "../../store";

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const products = useSelector((state:RootState)=>state.products.items);
    const isLoading = useSelector((state:RootState)=>state.products.status);
    const error = useSelector((state:RootState)=>state.products.error);

    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>({ title: 'Unknown Product', description: '', category: '', price: 0, image: ''});

    useEffect(()=>{
        if (id){
            let p = products.find(product=>product.id===id);
            if(p) setProduct(p);
        }
    },[products, id]);

    const deleteProduct = async(id:any)=>{
        try{
            await deleteDoc(doc(db, 'products', id));
        }catch(error){
            console.error(error);
        }
    }

    const handleAddToCart = (id:string, price: number)=>{
        dispatch(addItem({id, price}));
    }

    return (
        <Container className="product-detail p-3 rounded mt-3 text-center">
            <div className='text-center'>
                {isLoading==='loading'&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
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
                {product.title !=='Unknown Product' && <Button variant="primary" className="mx-2" onClick={() => handleAddToCart(id, product.price)}>Add to Cart</Button>}
                <Button onClick={()=>navigate('/home/')} className="mx-2 btn btn-secondary">Keep Shopping</Button>
            </div>
            {user&&<div className='mt-3'><Button variant='danger' onClick={()=>deleteProduct(product.id)}>Delete Product</Button></div>}
        </Container>
    );    
};

export default ProductDetails;