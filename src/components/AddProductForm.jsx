// AddProductForm.tsx
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Container, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NoAccess from './Other/NoAccess';


const AddProductForm = () => {
    const { id } = useParams();
    const [data, setData] = useState({ title: '', image: '', price:0, description: '', category: '' });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async(id)=>{
            try{
            const docSnap = await getDoc(doc(db, 'products', id));
            const data = docSnap.data();
            console.log(data);
            setData({ title: data.title, image: data.image, price:data.price, description: data.description, category:data.category });
            }catch(error){
                console.error('Error fetching user: ', error);
            }
        }
        if(id){
            fetchData(id);
        }else{
            setData({ title: '', image: '', price:0, description: '', category: '' });
        }
        
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: name === 'price' ? parseFloat(value) : value });
    };

    const updateProduct = async (id, updatedData) => {
        const productDoc = doc(db, 'products', id);
        await updateDoc(productDoc, updatedData);
    };

    const clearForm = () => {
        setData({ title: '', image: '', price:0, description: '', category: '' });
        navigate('/add-product/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id){
                await updateProduct(id, data);
            }else{
                await addDoc(collection(db, 'products'), data);
            }
            alert(`Data ${id?'updated':'added'}!`);
            setData({ title: '', image: '', price:0, description: '', category: '' }); // reset form
            navigate('/home/');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    if(!user)return(<NoAccess/>);

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loginForm mt-5 p-5 rounded shadow-lg">
            <h1 className='text-center'>Product Form</h1>
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
                <Form.Select name='category' onChange={handleChange} aria-label="Select a category" required>
                    <option value=''>Select a Category</option>
                    <option value='shoes'>Shoes</option>
                    <option value="women's clothing">Women's Clothing</option>
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
};

export default AddProductForm;