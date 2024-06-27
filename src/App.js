import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar'
import Annotation from './pages/Annotation'
import Referat from './pages/Referat'
import KeyWords from './pages/KeyWords'

function App() {
  return (
    <BrowserRouter basename='/'>
    <Routes>
        <Route path='/' element={<Navbar child={<Annotation />} />} />
        <Route path='/referat' element={<Navbar child={<Referat />} />} />
        <Route path='/key-words' element={<Navbar child={<KeyWords />} />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;