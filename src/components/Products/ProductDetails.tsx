import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Product } from '../../utilities/objectUtilities';
import { addItem } from "../../features/cartSlice";
import { RootState } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const products = useSelector((state:RootState)=>state.products.items);
    const isLoading = useSelector((state:RootState)=>state.products.status);
    const error = useSelector((state:RootState)=>state.products.error);
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>({ title: 'Unknown Product', description: '', category: '', price: 0, image: ''});

    // When product list or id are updated, find the product to display among the list
    useEffect(()=>{
        if (id){
            let p = products.find(product=>product.id===id);
            if(p) setProduct(p);
        }
    },[products, id]);

    // Delete Product function
    const deleteProduct = async(id:any)=>{
        try{
            await deleteDoc(doc(db, 'products', id));
            alert('Product was successfully deleted!');
            navigate('/home');
        }catch(error){
            console.error(error);
        }
    }

    // Function to add product to cart
    const handleAddToCart = (id:string, price: number)=>{
        dispatch(addItem({id, price}));
        alert('Product was added to cart.');
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
            <div className='text-center'>
                {product.title !=='Unknown Product' && <Button variant="primary" onClick={() => handleAddToCart(id, product.price)}>Add to Cart</Button>}&nbsp;
                <Button onClick={()=>navigate('/home/')} className="btn btn-secondary">Keep Shopping</Button>
            </div>
            <div className='text-center mt-3' >
                {user&&<>
                <Button variant="dark" onClick={()=>{navigate(`/edit-product/${product.id}`)}}><FontAwesomeIcon icon={faEdit}/></Button>&nbsp;
                <Button variant='danger' onClick={()=>deleteProduct(product.id)}><FontAwesomeIcon icon={faTrash}/></Button></>}
            </div>        
        </Container>
    );    
};

export default ProductDetails;