// AddUserForm.tsx
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Container, Button } from 'react-bootstrap';
import UsersList from './UsersList';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { User } from '../utilities/objectUtilities';
import { useAuth } from '../context/AuthContext';
import NoAccess from './NoAccess';

const AddUserForm = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [data, setData] = useState<Omit<User, 'id'>>({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async(id:string)=>{
            try{
            const docSnap = await getDoc(doc(db, 'users', id));
            const data = docSnap.data() as User;
            setData({name:data.name, email:data.email, phone:data.phone, address:data.address});
            }catch(error){
                console.error('Error fetching user: ', error);
            }
        }
        if(id){
            fetchData(id);
        }else{
            setData({ name: '', email: '', phone: '', address: '' });
        }
        
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const updateUser = async (userId:string, updatedData:any) => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, updatedData);
    };

    const clearForm = () => {
        setData({ name: '', email: '', phone: '', address: '' });
        navigate('/add-user/');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id){
                await updateUser(id, data);
            }else{
                await addDoc(collection(db, 'users'), data);
            }
            alert(`Data ${id?'updated':'added'}!`);
            setData({ name: '', email: '', phone: '', address: '' }); // reset form
            navigate('/add-user/');
            window.location.reload();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    if(!user)return(<NoAccess/>);

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loginForm mt-5 p-5 rounded shadow-lg">
            <h1 className='text-center'>User Profile Form</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
                <Form.Label>Full Name: </Form.Label>
                <Form.Control name="name" type='name' value={data.name} onChange={handleChange} placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Email: </Form.Label>
                <Form.Control name="email" type="email" value={data.email} onChange={handleChange} placeholder="user@example.com" />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Phone: </Form.Label>
                <Form.Control name="phone" type="tel" value={data.phone} onChange={handleChange} placeholder="###-###-####" />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Address: </Form.Label>
                <Form.Control name="address" type="text" value={data.address} onChange={handleChange} placeholder="Enter your address, including zip code and country" />
            </Form.Group>
        <div className='text-center'>
            <Button className='m-3' type="submit">{id?'Update ':'Add '}User</Button>
            <Button className="btn btn-secondary m-3" onClick={()=>clearForm()}>Clear Form</Button>
        </div>
        </Form>
        <UsersList/>

        </div>
        </Container>
    );
};

export default AddUserForm;