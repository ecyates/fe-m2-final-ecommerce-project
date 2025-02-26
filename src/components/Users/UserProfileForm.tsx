// UserProfileForm.tsx
import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { User } from '../../utilities/objectUtilities';
import { useAuth } from '../../context/AuthContext';
import NoAccess from '../NoAccess';

const UserProfileForm: React.FC<UserProfileFormProps> = ({userId}) => {
    const { user } = useAuth();
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<Omit<User, 'id'>>({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    // Fetch user data on mount and if user Id updates
    useEffect(()=>{
        const fetchData = async(userId:string)=>{
            try{
            const docSnap = await getDoc(doc(db, 'users', userId));
            const data = docSnap.data() as User;
            setData({name:data.name, email:data.email, phone:data.phone, address:data.address});
            }catch(error){
                console.error('Error fetching user: ', error);
                setError('Error fetching user: '+error);
            }
        }
        if(userId){
            fetchData(userId);
        }else{
            // Otherwise, clear the form
            setData({ name: '', email: '', phone: '', address: '' });
        }
        // Always start at the top of the page
        window.scrollTo(0, 0);
    }, [userId]);

    // Function to handle change in form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    // Function to update the user in Firestore
    const updateUser = async (userId:string, updatedData:any) => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, updatedData);
    };


    const clearForm = () => {
        setData({ name: '', email: '', phone: '', address: '' });
        navigate('/users/');
    }

    const clearError = () => {
        setError('');
    }

    // Function to validate email
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Function to validate phone number
    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate email and phone number
        if (!isValidEmail(data.email)) {
            setError("Please enter a valid email address (e.g., user@example.com).");
            return;
        }
        if (!isValidPhoneNumber(data.phone)) {
            setError("Please enter a valid phone number (e.g., 123-456-7890 or +1 (123) 456-7890).");
            return;
        }

        try {
            if (userId) {
                await updateUser(userId, data);
            } else {
                await addDoc(collection(db, "users"), data);
            }
            alert(`Data ${userId ? 'updated' : 'added'}!`);
            navigate('/users/');
            setData({ name: '', email: '', phone: '', address: '' }); // reset form
            window.location.reload(); // Reload the page so the users with update
        } catch (error) {
            setError(`Error ${userId?'editing':'adding'} user: ${error.message}`);
        }
    };    

    // This is a restricted page. If there is no user, show No Access page
    if(!user)return(<NoAccess/>);

    return (
        <>
            <h1 className='text-center'> {!data.name?'Complete Your User Profile':'Edit User Profile'}</h1>
            {error&&<Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Full Name: </Form.Label>
                    <Form.Control 
                        name="name" 
                        type='name' 
                        value={data.name} 
                        onChange={handleChange} 
                        onClick={clearError}
                        placeholder="Enter your name" />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control 
                        name="email" 
                        type="email" 
                        value={data.email} 
                        onChange={handleChange}
                        onClick={clearError} 
                        placeholder="user@example.com" />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Phone: </Form.Label>
                    <Form.Control 
                        name="phone" 
                        type="tel" 
                        value={data.phone} 
                        onChange={handleChange} 
                        onClick={clearError}
                        placeholder="###-###-####" />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Address: </Form.Label>
                    <Form.Control 
                        name="address" 
                        type="text" 
                        value={data.address} 
                        onChange={handleChange} 
                        onClick={clearError}
                        placeholder="Enter your address, including zip code and country" />
                </Form.Group>
                <div className='text-center'>
                    <Button className='m-3' type="submit">{userId?'Update ':'Add '}User</Button>
                    <Button className="btn btn-secondary m-3" onClick={()=>clearForm()}>Clear Form</Button>
                </div>
            </Form>
        </>
    );
};

export default UserProfileForm;

type UserProfileFormProps = {
    userId: string;
};