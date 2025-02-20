import { Badge, Card, Button, Row, Col, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Product, Cart } from '../utilities/objectUtilities';

const ProductCatalog = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([])
    const categories = ['shoes', 'skincare', 'womens clothing', 'technology'];
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const { user} = useAuth();
    const [cart, setCart] = useState<Cart>({products:{}, totalItems:0})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsLoading(true);
                const querySnapshot = await getDocs(collection(db, 'products'));
                const dataArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];
                setProducts(dataArray);
                if (user) {
                    const cartRef = doc(db, 'cart', user.uid);
                    const cartSnap = await getDoc(cartRef);
                    if (cartSnap.exists()) {
                        setCart(cartSnap.data() as Cart);
                    }
                }else{
                    const guestCart = localStorage.getItem('guest-cart');
                    setCart(guestCart ? JSON.parse(guestCart) : { products: {}, totalItems: 0 });
                }
                setIsLoading(false);
            }catch(error){
                setError(`Error loading content:  ${error}`);
            }
        };
        fetchData();
    }, [selectedCategory]);

    const deleteProduct = async(id:any)=>{
        try{
            await deleteDoc(doc(db, 'products', id));
            setIsLoading(true);
            setError('');
            location.reload();
        }catch(error){
            setError(`Error deleting product:  ${error}`);
        }
    }

    const handleAddToCart = async (id: any) => {
        try {
            let updatedCart = {...cart};
            updatedCart.products[id] = (updatedCart.products[id] || 0) + 1;
            updatedCart.totalItems++;
        
            if (user){
                const cartRef = doc(db, 'cart', user.uid);
                await setDoc(cartRef, updatedCart);
            }else {
                // Guest update (localStorage)
                localStorage.setItem("guest-cart", JSON.stringify(updatedCart));
            }
            setCart(updatedCart);
            alert('Product added to cart.');
            setIsLoading(true);
            setError('');
            location.reload();
        }catch(error){
            setError(`Error adding product:  ${error}`);
        }
    };  

    return(
        <Container className='product-catalog p-3 rounded mt-3'>
            <h1 className='text-center mb-3'>Product Catalog</h1>
            <div className='text-center'>
            {isLoading&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
            {error&&<Alert variant='danger'>{error}</Alert>}
            </div>
            {products.length>0?(
            <>
                <Form style={{width:'200px'}} className='mb-3'>
                    <Form.Select onChange={(e)=>setSelectedCategory(e.target.value)} aria-label="Filter products by category">
                        <option value=''>Filter Products</option>
                        {categories?.map(category=>(
                        <option key={category} value={category}>{category}</option>
                        ))}
                    </Form.Select>
                </Form>
                <Row xs={1} md={4} className='g-4'>
                    {products.filter(product=>selectedCategory?product.category===selectedCategory:product===product).map(product=>(
                        <Col md={4} key={product.id}>
                        <Card>
                            <Card.Header>
                            <Card.Img variant="top" src={product.image} style={{height:'250px', objectFit:'contain'}}></Card.Img>
                            </Card.Header>
                            <Card.Body>
                                <Badge className="bg-secondary">{product.category}</Badge>
                                <div className='text-center mt-2'>
                                <Card.Title><strong>{product.title}</strong></Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Title className='text-white'><strong>${product.price.toFixed(2)}</strong></Card.Title>
                                <Button variant="primary" onClick={()=>{handleAddToCart(product.id)}}>Add to Cart</Button>&nbsp;
                                {!user?<Button variant="secondary" onClick={()=>{navigate(`/product-detail/${product.id}`)}}>View Details</Button>:
                                <Button variant="secondary" onClick={()=>{navigate(`/edit-product/${product.id}`)}}>Edit Product</Button>}
                                {user&&<div><Button className='mt-3' variant='danger' onClick={()=>deleteProduct(product.id)}>Delete Product</Button></div>}
                                </div>
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
                </Row>
            </>
            ):(
                <p>Currently no products available</p>
            )}
            <div className='m-5 text-center'>
                {user&&<Button onClick={()=>navigate('/add-product/')}>Add New Product</Button>}
            </div>
        </Container>
    );
};

export default ProductCatalog;