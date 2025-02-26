// UserCard.tsx
import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, Badge } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { User } from '../../utilities/objectUtilities';
import { useAuth } from '../../context/AuthContext';
import OrdersList from '../Orders/OrdersList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currUser, setCurrUser] = useState<User|null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch users list on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as User[];
                setUsers(dataArray);
            }catch(error){
                console.error(`Error loading content: ${error}`);
            }
        };
        fetchData();
    }, []);

    // Once users list or user Id are updated, find the user among the list
    useEffect(()=>{
        let u = users.find(user=>user.id===userId);
        setCurrUser(u);
    }, [userId, users])

    // deleteUser Function
    const deleteUser = async (userId: string) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } catch (error: any) {
            console.error(`Error deleting user: ${error.message}`);
        }
    };

    // Function to sign out and return home
    const signOut = async (e) => {
        e.preventDefault();
        try{
            await signOut(auth);
            alert('Successfully logged out!');
            navigate('/home/');
        }catch(error:any){
            console.error(error.message);
        }
    }

    return (
        <>
        {currUser&&<Card className='userCard' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>
                    <div className='mb-3'>{currUser.id===user?.uid&&
                        <Badge className="bg-secondary">Current</Badge>}</div>
                        {currUser.name&&<h3 className='text-center mt-3'><strong>{currUser.name}</strong></h3>}
                </Card.Title>
            {currUser.name?(
            <div className='p-2'>
                {currUser.email&&<div><b>Email</b>: {currUser.email}</div>}
                {currUser.phone&&<div><b>Phone</b>: {currUser.phone}</div>}
                {currUser.address&&<div><b>Address</b>: {currUser.address}</div>}
                <OrdersList userId={currUser.id}/>
                <div className='text-center mt-3'>
                <Button variant='primary' onClick={()=>navigate(`/edit-user/${currUser.id}#form`)}><FontAwesomeIcon icon={faEdit}/></Button>&nbsp;
                <Button variant='danger' onClick={() => deleteUser(currUser.id)}><FontAwesomeIcon icon={faTrash}/></Button>&nbsp;
                {/* Add a Sign Out button for the current user card*/}
                {currUser.id===user?.uid&&<Button className='btn btn-secondary' onClick={signOut}>Sign Out</Button>}
                </div>
            </div>
            ): (
            <Card.Text className='text-center'>
                <div className='lead mb-3'>No profile created for {currUser.email}.</div>
                <Row className='text-center'>
                <Col><Button variant='danger' onClick={()=>navigate(`/edit-user/${currUser.id}#form`)}>Add Now</Button></Col>
                {currUser.id!==user?.uid&&<Col><Button className='btn btn-secondary' onClick={() => deleteUser(currUser.id)}><FontAwesomeIcon icon={faTrash}/></Button></Col>}
                </Row>
            </Card.Text>
            )}
            </Card.Body>
        </Card>}
        </>
    );
};

export default UserCard;

type UserCardProps = {
    userId: string;
};