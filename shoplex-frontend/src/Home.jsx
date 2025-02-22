import React, { useState, useEffect } from 'react'
import './App.css'
import Nav from './components/Nav'
import Card from './components/Card'
import CartComp from './components/Cart'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from './feature/auth/authSlice'
import { setCart } from './feature/cart/cartSlice'

const Home = () => {
    const dispatch = useDispatch()
    const { loggedIn, role } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState({});
    useEffect(() => {
        fetch('http://localhost:8080/shoplex/home/products', { method: 'GET' })
            .then(res => res.json())
            .then(json => {
                const updatedProducts = json.map(product => {
                    const minPrice = Math.min(...product.vendorProducts?.map(vp => vp.price));
                    return { ...product, minPrice };
                  });
                  setProducts(updatedProducts);
            })
    }, [])
    

    
    
    useEffect(() => {
        if (loggedIn) {
          fetch('http://localhost:8080/shoplex/customer/showwishlist', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(res => res.json())
            .then(json => {
              setWishlist(json);
            });
        }
      }, [loggedIn]);
    
      const isProductInWishlist = (productId) => {
        return wishlist.products?.some(item => item.id === productId);
      };
    return (
        <div className='flex flex-col text-black relative font-mono '>
            
            <div className="main flex justify-center items-center">
                {products.length !== 0 ? <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => {
                        const inwish = isProductInWishlist(product?.id)
                        return <Card product={product}
                            inwish={inwish}
                        />
                    })}
                </div> : <div className="text-center text-gray-600 text-4xl mt-48">No Products in the shop.</div>}
                
            </div>
        </div>
    )
}

export default Home
