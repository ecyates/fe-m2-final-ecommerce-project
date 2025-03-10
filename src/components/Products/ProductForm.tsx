// ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Container, Button, Alert, Spinner } from 'react-bootstrap';
import { db } from '../../firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Product } from '../../utilities/objectUtilities';
import { useAuth } from '../../context/AuthContext';
import NoAccess from '../Other/NoAccess';

const ProductForm = () => {
    const { id } = useParams();
    const [data, setData] = useState<Omit<Product, 'id'>>({ title: '', image: '', price:0, description: '', category: '' });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch data when passed a new product id
    useEffect(()=>{
        const fetchData = async(id:string)=>{
            try{
                setIsLoading(true);
                const docSnap = await getDoc(doc(db, 'products', id));
                const data = docSnap.data() as Product;
                setData({ title: data.title, image: data.image, price:data.price, description: data.description, category:data.category });
            }catch(error){
                setError('Error fetching product data: '+error);
            }finally{
                setIsLoading(false);
            }
        }
        if(id){
            fetchData(id);
        }else{
            setData({ title: '', image: '', price:0, description: '', category: '' });
            setIsLoading(false);
        }
        
    }, [id]);

    // Function to handle change in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: name === 'price' ? parseFloat(value) : value });
    };

    // Function to update the product in Firestore
    const updateProduct = async (id:string, updatedData:any) => {
        try {
            const productDoc = doc(db, 'products', id);
            await updateDoc(productDoc, updatedData);
        }catch(error){
            setError('Error updating product: '+error);
        }
    };

    // Function to clear form and navigate to add-product
    const clearForm = () => {
        setIsLoading(false);
        setData({ title: '', image: '', price:0, description: '', category: '' });
        navigate('/add-product/');
    }

    // Function to handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            // If we're editing the product, perform updateProduct function 
            if (id){
                await updateProduct(id, data);
            // If we're add a new product, addDoc to Firestore
            }else{
                await addDoc(collection(db, 'products'), data);
            }
            setIsLoading(false);
            alert(`Product ${id?'updated':'added'}!`);
            setData({ title: '', image: '', price:0, description: '', category: '' }); // reset form
            navigate('/home/');
        } catch (error) {
            setIsLoading(false);
            setError(`Error ${id?'editing':'adding'} document: ${error.message}`);
        }
    };

    if (user){
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100 loginForm mt-5 p-5 rounded shadow-lg">
            <div>
            <h1 className='text-center'>Product Form</h1>
            <div className='text-center'>{isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
            {error&&<Alert variant='danger'>{error}</Alert>}</div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Product Name: </Form.Label>
                    <Form.Control name="title" type='name' value={data.title} onChange={handleChange} placeholder="Enter the product's name" required/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Description: </Form.Label>
                    <Form.Control name="description" type="text" value={data.description} onChange={handleChange} placeholder="Enter the product's description" required/>
                </Form.Group>
                <div className='text-center'>{data.image&&<img src={data.image} alt={data.image} width={100}/>}</div>
                <Form.Group className='mb-3'>
                    <Form.Label>Image: </Form.Label>
                    <Form.Control name="image" type="text" value={data.image} onChange={handleChange} placeholder="Enter the image URL" required/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Price: </Form.Label>
                    <Form.Control name="price" type="number" step='0.01' value={data.price} onChange={handleChange} required/>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Category: </Form.Label>
                    <Form.Select name='category' value={data.category} onChange={handleChange} aria-label="Select a category" required>
                        <option value=''>Select a Category</option>
                        <option value='shoes'>Shoes</option>
                        <option value="women's clothing">Women's Clothing</option>
                        <option value="men's clothing">Men's Clothing</option>
                        <option value="skincare">Skincare</option>
                        <option value="technology">Technology</option>
                    </Form.Select>       
                </Form.Group>
                <div className='text-center'>
                    <Button className='m-3' type="submit">{id?'Update ':'Add '}Product</Button>
                    <Button className="btn btn-secondary m-3" onClick={()=>clearForm()}>Clear Form</Button>
                </div>
            </Form>
            </div>
            </Container>
        );
    }else{
        return(<>{!isLoading&&<NoAccess/>}</>);
    }
};

export default ProductForm;