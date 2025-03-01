import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { setCart } from '../feature/cart/cartSlice'
import { useNavigate } from 'react-router'
import { toast,Bounce } from 'react-toastify'

const Order = () => {
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const { cart } = useSelector((state)=>state.cart)
 const { user } = useSelector((state)=>state.auth)
 const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart?.items?.reduce((acc, item) => acc + item.vendorProduct.price * item.quantity, 0) || 0
    const handlePayment = async () => {
        let orderItems = cart.items.map(item => {
            let vp = { ...item.vendorProduct }
            delete vp.product
            delete vp.vendor
            return { ...item, vendorProduct: vp }
          })
      
          // Create order object
          let order = { orderItems, totalAmount: totalPrice }
          console.log(order)
        // Fetch order ID from backend
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/customer/placeOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(order),
        })
        const data = await response.json()
        const { paymentId } = data
    
        // Initialize Razorpay
        const options = {
          key: 'rzp_test_wLaYh8MVlCJXGc', // Replace with your Razorpay key ID
          amount: totalPrice * 100, // Amount in paise
          currency: 'INR',
          name: 'Shoplex',
          description: 'Order Payment',
          order_id: paymentId,
          handler: function (response) {
            toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`,{position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce}
    )
            navigate('/')
            // Handle post-payment actions here
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phoneNumber,
          },
          theme: {
            color: '#3399cc',
          },
        }
    
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
  return (
    <div className='flex justify-center items-center flex-col w-full'>
      <div className='text-5xl'>Order Details</div>
      <div className='w-2/3 flex flex-col gap-4'>
        {cart.items.map((item,index)=>{
            const vp = item.vendorProduct
            return <div key={index} className='flex justify-between gap-4 m-4 bg-emerald-200 p-3 rounded-lg'>
             <div className='text-3xl flex flex-row'>
             <img className='rounded-lg w-32 h-32' src={vp.product.imageUrl} alt="" />
             <p>{vp.product.name}</p></div>
             <div className='text-2xl'>Price:{vp.price}Rs.</div>
            </div>
        })
        }
      </div>
      <footer className='text-2xl flex flex-row justify-between items-start w-2/3  p-3'>
       <div className='flex flex-col gap-2'>
        <p>Total Price: {totalPrice}Rs.</p>
        <p>Total Items: {totalItems}</p>
        </div>
        <button onClick={handlePayment} className=' bg-amber-600 rounded-3xl p-4'>Proceed To Payment</button>
      </footer>
    </div>
  )
}

export default Order
