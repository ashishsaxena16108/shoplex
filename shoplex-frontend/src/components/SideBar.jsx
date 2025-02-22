import React,{ useState,useEffect } from 'react'
import Move from '../assets/move.svg'
import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setRole } from '../feature/auth/authSlice'
const SideBar = ({ open }) => {
  const dispatch = useDispatch()
  const [openCateg, setopenCateg] = useState(false)
  const [openBrand, setopenBrand] = useState(false)
  const [categories, setcategories] = useState([])
  const [brands, setbrands] = useState([])
  useEffect(() => {
    fetch('http://localhost:8080/shoplex/home/categories', { method: 'GET' })
        .then(res => res.json())
        .then(json => {
            setcategories(json)
        })
    
  }, [])
  
  return (
    <div id='sidebar' className={`fixed top-[66px] left-0 h-screen w-64 bg-white shadow-lg z-50 transform ${open ? 'translate-x-0' : 'translate-x-[-260px]'} transition-transform duration-500 ease-in-out`}>
        <ul className='flex flex-col gap-4'>
        
        <li className='text-2xl w-full p-4 hover:bg-gray-300'><span onClick={()=>setopenCateg(!openCateg)}>Categories</span>
        <ul className={`flex flex-col gap-4 ${openCateg ? 'block' : 'hidden'}`}>
            {categories.map((category) => {
            return <li className='text-2xl w-full p-4 hover:bg-gray-400'>{category}</li>
            })}
        </ul>
        </li>
        <li className='text-2xl w-full p-4 hover:bg-gray-300'>Brands</li>    
        <li className='text-2xl w-full p-4 hover:bg-gray-300 flex flex-row justify-between'><span>Vendor's Page</span><Link to={{
                pathname: '/vendor'}} ><img src={Move} onClick={()=>dispatch(setRole({role:"VENDOR"}))}/></Link></li>
        <li className='text-2xl w-full p-4 hover:bg-gray-300 flex flex-row justify-between'><span>Admin's Page</span><Link to='/vendor'><img src={Move}/></
        Link></li>
        </ul>
    </div>
  )
}

export default SideBar
