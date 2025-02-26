import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts } from '../../features/productsSlice';
import { Product } from '../../utilities/objectUtilities';
import { RootState, AppDispatch } from '../../store';
import { Button, Row, Col, Form, Container, Spinner, Alert } from 'react-bootstrap';

const ProductCatalog:React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const allProducts = useSelector((state:RootState)=>state.products.items);
    const isLoading = useSelector((state:RootState)=>state.products.status);
    const error = useSelector((state:RootState)=>state.products.error);
    const [products, setProducts] = useState<Product[]>(allProducts||[]);
    const { user} = useAuth();
    
    const categories = ['Shoes', 'Skincare', "Women's Clothing", "Men's Clothing", 'Technology'];
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        dispatch(fetchProducts()); // Fetch products when the component mounts
    }, [dispatch]);

    useEffect(() => {
        if (selectedCategory){
            setProducts(allProducts.filter(product=>product.category===selectedCategory));
        }else{
            setProducts(allProducts);
        }
    }, [selectedCategory, allProducts]);

    return(
        <Container className='product-catalog p-3 rounded mt-5 p-5 shadow-lg'>
                    {/* <Container className="d-flex justify-content-center align-items-center min-vh-100 loginForm mt-5 p-5 rounded shadow-lg"> */}
            
            <h1 className='text-center mb-3'>Product Catalog</h1>
            <div className='text-center'>
            {isLoading==='loading'&&<Spinner animation='border' role='status'><span className='visually-hidden'>Loading...</span></Spinner>}
            {error&&<Alert variant='danger'>{error}</Alert>}
            </div>
            {products.length>0?(
            <>
                <Form style={{width:'200px'}} className='mb-3'>
                    <Form.Select onChange={(e)=>setSelectedCategory(e.target.value)} aria-label="Filter products by category">
                        <option value=''>Filter Products</option>
                        {categories?.map(category=>(
                        <option key={category} value={category.toLowerCase()}>{category}</option>
                        ))}
                    </Form.Select>
                </Form>
                <Row xs={1} md={4} className='g-4'>
                    {products.filter(product => !selectedCategory || product.category === selectedCategory).map(product=>(
                        <Col md={4} key={product.id}>
                        <ProductCard productId={product.id}/>
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

