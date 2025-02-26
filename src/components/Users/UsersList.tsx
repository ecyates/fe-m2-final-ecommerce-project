// UsersList.tsx
import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Spinner, Alert } from 'react-bootstrap';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { User } from '../../utilities/objectUtilities';
import UserCard from './UserCard';
import UserProfileForm from './UserProfileForm';

const UsersList = () => {
    const { id } = useParams();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Fetch users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try{
                setIsLoading(true);
                const snapshot = await getDocs(collection(db, "users"));
                const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersList);
                setIsLoading(false);
                setError('');
            }catch(error){
                setError('Error fetching users: '+error.message);
            }
        };
        fetchUsers();
    }, []);

    return (
        <Container className='product-catalog p-3 rounded mt-5 p-5 shadow-lg'>            
        <div> 
        {id&&<UserProfileForm userId={id}/>}
        <h1 className='text-center mt-3'>Users</h1>
        <Row className='d-flex justify-content-around align-items-center'>
        <div className='text-center'>
        {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
        {error&&<Alert variant='danger'>{error}</Alert>}
        </div>
            {users.length === 0 ? (
                (!isLoading&&<span>Currently no users...</span>)
            ) : (<>{users.map((u) => (
                    <Col key={u.id} className='mb-3'>
                        <UserCard userId={u.id}/>
                    </Col>
                ))}
            </>)}
        </Row>
        </div>
        </Container>
    );
};

export default UsersList;