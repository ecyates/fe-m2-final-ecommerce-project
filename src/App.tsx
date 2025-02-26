import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import ShoppingCart from './components/Cart/ShoppingCart';
import ProductDetails from './components/Products/ProductDetails';
import Login from './components/Login';
import ProductForm from './components/Products/ProductForm';
import OrderDetails from './components/Orders/OrderDetails';
import UsersList from './components/Users/UsersList';

function App() {

  return (
    <>
      <NavBar/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/view-cart' element={<ShoppingCart/>}/>
          <Route path='/product-detail/:id' element={<ProductDetails/>}/>
          <Route path='/login/' element={<Login/>}/>
          <Route path='/users/' element={<UsersList/>}/>
          <Route path='/edit-user/:id' element={<UsersList/>}/>
          <Route path='/add-product/' element={<ProductForm/>}/>
          <Route path='/edit-product/:id' element={<ProductForm/>}/>
          <Route path='/order-details/:id' element={<OrderDetails/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
    </>
  );
};

export default App;