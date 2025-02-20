import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import { Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ShoppingCart from './components/ShoppingCart';
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import AddUserForm from './components/AddUserForm';
import AddProductForm from './components/AddProductForm';

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
          <Route path='/add-user/' element={<AddUserForm/>}/>
          <Route path='/edit-user/:id' element={<AddUserForm/>}/>
          <Route path='/add-product/' element={<AddProductForm/>}/>
          <Route path='/edit-product/:id' element={<AddProductForm/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
    </>
  );
};

export default App;