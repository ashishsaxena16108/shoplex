import React, { useEffect,useRef,useState } from 'react'
import Nav from './components/Nav'
import { Outlet, RouterProvider, useFetcher, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from './feature/cart/cartSlice'
import { setRole,login } from './feature/auth/authSlice'
import { ToastContainer,toast } from 'react-toastify';
const App = ({ }) => {
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.cart)
  const { loggedIn } = useSelector((state)=>state.auth)
  const location = useLocation()
  useEffect(() => {
    let token = localStorage.getItem('token');
    if(token){
      const decodeToken = (token) => JSON.parse(atob(token.split('.')[1]));
      const isTokenExpired = (token) => decodeToken(token).exp * 1000 < Date.now();
      if(!isTokenExpired(token)){
        fetch('http://localhost:8080/shoplex/auth/verifyToken',{method:'POST',
          body:token
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.error){}
          else{
            dispatch(login({role:data.user.role,user:data.user}))
          }
        })
    }
  }
  }, [])
  
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        dispatch(setCart(parsedCart))
      } catch (error) {
        console.error("Error parsing stored cart:", error)
      }
    }
    else {
      dispatch(setCart({ items: new Array(0) }))
    }
  }, [dispatch]);
  useEffect(() => {
    if (cart.items.length > 0) { // Prevent empty resets
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  if(loggedIn){
          if(cart.items.length===0){
          useEffect(() => {
              fetch('http://localhost:8080/shoplex/customer/savecart',{method:'POST',body:JSON.stringify(cart),headers:{
                  'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}
              });
          }, [cart,loggedIn])
        }
      }
  useEffect(() => {
    if (location.pathname.startsWith('/vendor')) {
      dispatch(setRole({role:'VENDOR'}))
    }
    else if(location.pathname.startsWith('/vendor')){
      dispatch(setRole({role:'DELIVERY_PERSONNEL'}))
    }
  }, [location, dispatch])
  return (
    <div>
      <Nav />
      <ToastContainer/>
      <Outlet />
    </div>
  )
}

export default App
