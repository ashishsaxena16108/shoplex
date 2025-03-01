import React,{ useState } from 'react'
import Bars from '../assets/bars.svg'
import Close from '../assets/closelight.svg'
import User from '../assets/userlight.svg'
import CartImg from '../assets/cart.svg'
import SideBar from './SideBar'
import Cart from './Cart'
import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from '../feature/auth/authSlice'
const Nav = ({frole}) => {
  const [openSideBar, setOpenSideBar] = useState(false)
  const [cart, setCart] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const { loggedIn, role,user } = useSelector((state) => state.auth)
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
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    setMenuOpen(false)
  }
  return (
    <nav>
    <div className='flex justify-between items-center h-[65px] bg-gradient-to-r from-cyan-950 via-indigo-950 to-emerald-950 relative shadow-sm font-mono text-3xl text-white'>
      <h1 className='mx-4 flex gap-6'><button onClick={handleBtn}><img id='img' src={Bars}/></button><Link to='/'><span>Shoplex {role==='VENDOR'?'Business':''}</span></Link></h1>
      {
        (!loggedIn ?     
        <ul className='flex flex-row text-2xl gap-4 m-2'>
        {role!=="VENDOR" && <li className='cursor-pointer'><button onClick={()=>setCart(true)} className='py-auto pt-1 mt-2 cursor-pointer'><img src={CartImg}/></button></li>}
        <li className=' m-3 cursor-pointer'><Link to={role==="VENDOR"?"/vendor/login":role==="DELIVERY_PERSONNEL"?"/delivery/login":role==="ADMIN"?"/admin/login":"/login"}>LogIn</Link></li>
        <li className=' cursor-pointer m-3'><Link to={role==="VENDOR"?"/vendor/signin":role==="DELIVERY_PERSONNEL"?"/delivery/signin":role==="ADMIN"?"/admin/signin":"/signin"}>SignUp</Link></li>
        </ul>
        :
        <ul className='flex text-2xl gap-4'>
        {role!=="Business" && <li className='cursor-pointer'><button onClick={()=>setCart(true)} className='py-auto pt-4 mt-2'><img src={CartImg}/>
        </button></li>}
        <li className=' cursor-pointer m-3'><button onClick={() => setMenuOpen(!menuOpen)}><img src={user.profileImageUrl?user.profileImageUrl:User} className='rounded-full w-14 h-14 mt-2' alt="" /></button>
                {menuOpen && (
                  <div className='fixed right-6 top-14 mt-2 w-48 text-black bg-white border border-gray-300 rounded-lg shadow-lg animate-fade-in z-20'>
                    <ul className='py-1'>
                    <Link to='/account' onClick={() => setMenuOpen(false)}><li className='px-4 py-2 hover:bg-gray-100'>Account</li></Link>
                      <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>)}
                  </li> 
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
