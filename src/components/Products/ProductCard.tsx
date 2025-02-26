import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { addItem } from '../../features/cartSlice';
import { fetchProducts } from '../../features/productsSlice';
import { Product } from '../../utilities/objectUtilities';
import { RootState, AppDispatch } from '../../store';
import { Badge, Card, Button} from 'react-bootstrap';

const ProductCard: React.FC<ProductCardProps> = ({ productId }) => {
    const products = useSelector((state:RootState)=>state.products.items);
    const [product, setProduct] = useState<Product|null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch products when the component mounts
    useEffect(() => {
        dispatch(fetchProducts()); 
    }, [dispatch]);

    // Update product when id changes
    useEffect(()=>{
        if (productId){
            let p = products.find(product=>product.id===productId);
            if(p) setProduct(p);
        }
    },[products, productId]);

    // Function to delete product
    const deleteProduct = async(id:string)=>{
        try{
            await deleteDoc(doc(db, 'products', id));
        }catch(error){
            console.error(error);
        }
    };

    // Function to add product to cart
    const handleAddToCart = (id:string, price:number) => {
        dispatch(addItem({id, price}));
    };

    return(
        <>
        {product&&(
        <Card>
            <Card.Header>
            <Card.Img 
                variant="top" 
                src={product.image || 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                style={{height:'250px', objectFit:'contain'}} 
                alt={`${product.title} Image`}/>
            </Card.Header>
            <Card.Body>
                <Badge className="bg-secondary">{product.category}</Badge>
                <div className='text-center mt-2'>
                <Card.Title><strong>{product.title}</strong></Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Title className='text-white'><strong>${product.price.toFixed(2)|| "N/A"}</strong></Card.Title>
                <Button variant="primary" onClick={()=>{handleAddToCart(product.id, product.price)}}>Add to Cart</Button>&nbsp;
                {!user?<Button variant="secondary" onClick={()=>{navigate(`/product-detail/${product.id}`)}}>View Details</Button>:
                <Button variant="secondary" onClick={()=>{navigate(`/edit-product/${product.id}`)}}>Edit Product</Button>}
                {user&&<div><Button className='mt-3' variant='danger' onClick={()=>deleteProduct(product.id)}>Delete Product</Button></div>}
                </div>
            </Card.Body>
        </Card>)}
        </>
    );
};

export default ProductCard;

type ProductCardProps = {
    productId: string;
};