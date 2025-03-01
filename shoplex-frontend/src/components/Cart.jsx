import React from 'react'
import Close from '../assets/close.svg'
import CartItems from './CartItems'
import { useNavigate,Link } from 'react-router'
import Minus from '../assets/minus.svg'
import Plus from '../assets/plus.svg'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart, setCart } from '../feature/cart/cartSlice'
const Cart = ({ open, setopen }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cart } = useSelector((state) => state.cart)
    const { loggedIn } = useSelector((state)=>state.auth)
    const updateCart = (product, quantity) => dispatch(addToCart({ product, quantity }))
    const deleteFromCart = (productId) => dispatch(removeFromCart(productId))
    const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart?.items?.reduce((acc, item) => acc + item.vendorProduct.price * item.quantity, 0) || 0
    const handleOrderBtn = () => {
         if(loggedIn){
            setCart({items:[]})
            navigate('/order')
         }
         else{
            navigate('/login')
         }
    }
    return (
        <div className={`fixed top-[66px] right-0 h-[91vh] w-[520px] bg-white shadow-lg z-50 transform ${open ? 'translate-x-0' : 'translate-x-[520px]'} transition-transform duration-500 ease-in-out overflow-hidden`}>
            <div className='flex h-7/8 flex-col'>
                <div className='fixed top-3 right-3'><img onClick={() => setopen(false)} src={Close} alt="" /></div>
                <h1 className='text-3xl font-bold m-4'>Your Cart</h1>
                {cart?.items.length === 0 ? (
                    <p className='text-2xl text-center mt-56 text-gray-300'>Your cart is empty. <Link to="/" className=' text-blue-700 underline'>Go Shopping</Link></p>
                ) : (
                    <div className='flex flex-col justify-start h-full gap-7'>
                        {cart?.items.map((item) => {
                            const vp = item.vendorProduct
                            return <div key={vp.product.id} className="cart-item flex text-2xl">
                                <img src={vp.product.imageUrl} alt={vp.product.name} className="cart-image" width={150} />
                                <div>
                                    <h3 className='text'>{vp.product.name}</h3>
                                    <p>{vp.price.toFixed(2) || 0}</p>
                                    <div className="cart-controls flex flex-row gap-4">
                                        <button className='bg-gray-400 w-8 h-8 p-2 m-[6px] py-auto rounded-lg' onClick={() => updateCart(vp, item.quantity - 1)}><img src={Minus} /></button>
                                        <span className='p-2'>{item.quantity}</span>
                                        <div>
                                            <button className='bg-gray-400 p-2 rounded-lg' onClick={() => updateCart(vp, item.quantity + 1)}><img src={Plus} /></button>
                                            <button className=' bg-amber-600 rounded-full p-2 mx-4' onClick={() => deleteFromCart(vp.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className='absolute bottom-14 text-2xl font-bold m-3'>
                            <h3 className=''>Total Items: {totalItems}</h3>
                            <h3>Total Price: ${totalPrice}</h3>
                        </div>
                    </div>
                )}
                <footer className='flex flex-row justify-between fixed bottom-0 text-center text-2xl text-blue-700 underline w-9/10 m-2'><button onClick={() => setopen(false)}>Continue Shopping</button>
                    <button className='' onClick={handleOrderBtn}>Proceed To Buy</button></footer>
            </div>
        </div>
    )
}

export default Cart
