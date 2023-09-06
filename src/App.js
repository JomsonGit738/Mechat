import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login'
import SignIn from './pages/SignIn';

function App() {
  return (
    <>
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<SignIn/>}/>
    </Routes>
    </>
  );
}

export default App;
