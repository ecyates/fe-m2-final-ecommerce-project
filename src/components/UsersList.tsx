// UserProfile.tsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Button, Container, Col, Row, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User } from '../utilities/objectUtilities';
import { useAuth } from '../context/AuthContext';

const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // deleteUser Function
    const deleteUser = async (userId:any) => {
        try{
            await deleteDoc(doc(db, 'users', userId));
            setError('');
            location.reload;
        }catch(error){
            setError(`Error deleting user: ${error}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const querySnapshot = await getDocs(collection(db, 'users'));
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as User[];
                setUsers(dataArray);
                setError('');
                setIsLoading(false);
            }catch(error){
                setError(`Error loading content: ${error}`);
            }
        };
        fetchData();
    }, []);

    return (
        <Container>
            <h2 className='text-center mt-3'>Users</h2>
        <Row className='d-flex justify-content-around align-items-center'>
        {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
        {error&&<Alert variant='danger'>{error}</Alert>}
            {users.length === 0 ? (
                <p>Currently no users...</p>
            ) : (<>{users.map((tempUser) => (
                    <Col key={tempUser.id} className='mb-3'>
                        <Card className='userCard' style={{ width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>
                                <div className='mb-3'>{tempUser.id===user?.uid&&
                                    <Badge className="bg-secondary">Current</Badge>}</div>
                            </Card.Title>
                            {tempUser.name?(
                            <Card.Text>
                                <h3 className='text-center'><strong>{tempUser.name}</strong></h3>
                                <ul>
                                <li><b>Email</b>: {tempUser.email}</li>
                                <li><b>Phone</b>: {tempUser.phone}</li>
                                <li><b>Address</b>: {tempUser.address}</li>
                                </ul>
                                <Row className='text-center'>
                                    <Col><Button className='btn btn-primary' onClick={()=>navigate(`/edit-user/${tempUser.id}`)}>Edit</Button></Col>
                                    {/* Cannot delete the current user. */}
                                    {tempUser.id!==user?.uid&&<Col><Button className='btn btn-secondary' onClick={() => deleteUser(tempUser.id)}>Delete</Button></Col>}
                                </Row>
                            </Card.Text>
                            ): (
                            <Card.Text className='text-center'>
                                <div className='lead mb-3'>No profile created for {tempUser.email}.</div>
                                <Row className='text-center'>
                                <Col><Button className='btn btn-primary' onClick={()=>navigate(`/edit-user/${tempUser.id}`)}>Add Now</Button></Col>
                                {tempUser.id!==user?.uid&&<Col><Button className='btn btn-secondary' onClick={() => deleteUser(tempUser.id)}>Delete</Button></Col>}
                                </Row>
                            </Card.Text>
                            )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </>)}
            </Row>
        </Container>
    );
};

export default UsersList;