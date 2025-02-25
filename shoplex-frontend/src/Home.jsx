import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import Nav from './components/Nav'
import Card from './components/Card'
import CartComp from './components/Cart'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from './feature/auth/authSlice'
import { setCart } from './feature/cart/cartSlice'
import { setProducts } from './feature/product/productSlice'
import SideBar from './components/SideBar'
const Home = () => {
    const dispatch = useDispatch()
    const { loggedIn, role } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const { products } = useSelector((state)=>state.product)
    const [wishlist, setWishlist] = useState({});
    useEffect(() => {
        fetch('http://localhost:8080/shoplex/home/products', { method: 'GET' })
            .then(res => res.json())
            .then(json => {
                const updatedProducts = json.map(product => {
                    const minPrice = Math.min(...product.vendorProducts?.map(vp => vp.price));
                    return { ...product, minPrice };
                  });
                  dispatch(setProducts({products:updatedProducts}));
            })
    }, [dispatch])

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
            <SideBar setProducts={setProducts}/>
            <div className="main flex justify-center items-center">
                {products.length !== 0 ? <div className="products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => {
                        const inwish = isProductInWishlist(product?.id)
                        return <Card product={product}
                            inwish={inwish} key={product.id}
                        />
                    })}
                </div> : <div className="text-center text-gray-600 text-4xl mt-48">No Products in the shop.</div>}
                
            </div>
        </div>
    )
}

export default Home
