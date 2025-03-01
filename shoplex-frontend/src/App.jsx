import React, { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import { Outlet, RouterProvider, useFetcher, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from './feature/cart/cartSlice'
import { setRole, login } from './feature/auth/authSlice'
import { ToastContainer, toast,Bounce } from 'react-toastify';
const App = ({ }) => {
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.cart)
  const { loggedIn, role } = useSelector((state) => state.auth)
  const location = useLocation()
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      const decodeToken = (token) => JSON.parse(atob(token.split('.')[1]));
      const isTokenExpired = (token) => decodeToken(token).exp * 1000 < Date.now();
      if (!isTokenExpired(token)) {
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/verifyToken`, {
          method: 'POST',
          body: token
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              toast.error(data.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              })
            }
            else {
              dispatch(login({ role: data.user.role, user: data.user }))
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
  useEffect(() => {
    if (loggedIn && cart.items.length === 0) {
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/customer/savecart`, {
        method: 'POST',
        body: JSON.stringify(cart),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    }
  }, [cart, loggedIn])
  useEffect(() => {
    if (location.pathname.startsWith('/vendor')) {
      dispatch(setRole({ role: 'VENDOR' }))
    }
    else if (location.pathname.startsWith('/vendor')) {
      dispatch(setRole({ role: 'DELIVERY_PERSONNEL' }))
    }
    else if (location.pathname.startsWith('/admin')) {
      dispatch(setRole({ role: 'ADMIN' }))
    }
  }, [location, dispatch])
  return (
    <div>
      <Nav frole={role} />
      <ToastContainer />
      <Outlet />
    </div>
  )
}

export default App
