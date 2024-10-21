
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import CategoriesPage from './pages/CategoriesPage'
import NotFound from './pages/NotFound'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CategoriesPage />} />
        <Route path='products/:id' element={<ProductPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
