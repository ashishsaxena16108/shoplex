import React,{ useState } from 'react'
import Bars from '../assets/bars.svg'
import Close from '../assets/close.svg'
import User from '../assets/user.svg'
import CartImg from '../assets/cart.svg'
import SideBar from './SideBar'
import Cart from './Cart'
import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from '../feature/auth/authSlice'
const Nav = ({}) => {
  const [openSideBar, setOpenSideBar] = useState(false)
  const [cart, setCart] = useState(false)
  const dispatch = useDispatch()
  const { loggedIn, role } = useSelector((state) => state.auth)
  const handleBtn = () =>{
    const img = document.getElementById('img')
    if(openSideBar){
      setOpenSideBar(false)
      img.src = Bars
    }
    else{
      setOpenSideBar(true)
      img.src = Close
    }
  }
  return (
    <nav>
    <div className='flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono text-3xl'>
      <h1 className='mx-4 flex gap-6'><button onClick={handleBtn}><img id='img' src={Bars}/></button><span>Shoplex {role==='VENDOR'?'Business':''}</span></h1>
      {
        (!loggedIn ?     
        <ul className='flex flex-row text-2xl gap-4 m-2'>
        {role!=="VENDOR" && <li className='cursor-pointer'><button onClick={()=>setCart(true)} className='py-auto pt-1 mt-2 cursor-pointer'><img src={CartImg}/></button></li>}
        <li className=' m-3 cursor-pointer'><Link to={role==="VENDOR"?"/vendor/login":role==="DELIVERY_PERSONNEL"?"/delivery/login":"/login"}>LogIn</Link></li>
        <li className=' cursor-pointer m-3'><Link to={role==="VENDOR"?"/vendor/signin":role==="DELIVERY_PERSONNEL"?"/delivery/signin":"/signin"}>SignUp</Link></li>
        </ul>
        :
        <ul className='flex text-2xl gap-4'>
        {role!=="Business" && <li className='cursor-pointer'><button onClick={()=>setCart(true)} className='py-auto pt-1 mt-2'><img src={CartImg}/>
        </button></li>}
        <li className=' cursor-pointer m-3'><Link to='/account'><img src={User} alt="" /></Link></li> 
        </ul>)
       }
       {/* <p className=' absolute right-56 top-8 text-center bg-red-500 text-lg rounded-full h-6 w-6 text-white '>1</p> */}
    </div>
    <SideBar open={openSideBar}/>
    <Cart open={cart} setopen={setCart}/>
    </nav>
  )
}

export default Nav
