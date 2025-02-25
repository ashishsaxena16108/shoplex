import React,{ useState,useEffect,useContext } from 'react'
import Move from '../assets/move.svg'
import { Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '../feature/product/productSlice'
import { setRole } from '../feature/auth/authSlice'
const SideBar = ({ open }) => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)
  const [openCateg, setopenCateg] = useState(false)
  const [openBrand, setopenBrand] = useState(false)
  const [categories, setcategories] = useState([])
  const [brands, setbrands] = useState([])
  const handleFilter = (category) => {
    const url = category ? `http://localhost:8080/shoplex/home/products/${category}` : 'http://localhost:8080/shoplex/home/products'
    fetch(url, { method: 'GET' })
      .then(res => res.json())
      .then(json => {
        const updatedProducts = json.map(product => {
          const minPrice = Math.min(...product.vendorProducts?.map(vp => vp.price))
          return { ...product, minPrice }
        })
        dispatch(setProducts({ products: updatedProducts }))
      })
  }
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
            <li className='text-2xl w-full p-4 hover:bg-gray-400' onClick={()=>handleFilter(null)}>Show All</li>
            {categories.map((category,index) => {
            return <li className='text-2xl w-full p-4 hover:bg-gray-400' key={index} onClick={()=>handleFilter(category)}>{category}</li>
            })}
        </ul>
        </li>
        <li className='text-2xl w-full p-4 hover:bg-gray-300'>Brands</li>    
        <li className='text-2xl w-full p-4 hover:bg-gray-300 flex flex-row justify-between'><span>Vendor's Page</span><Link to={{
                pathname: '/vendor'}} ><img src={Move} onClick={()=>dispatch(setRole({role:"VENDOR"}))}/></Link></li>
        <li className='text-2xl w-full p-4 hover:bg-gray-300 flex flex-row justify-between'><span>Delivery's Page</span><Link to={{
                pathname: '/delivery'}} ><img src={Move} onClick={()=>dispatch(setRole({role:"DELIVERY_PERSONNEL"}))}/></Link></li>
        <li className='text-2xl w-full p-4 hover:bg-gray-300 flex flex-row justify-between'><span>Admin's Page</span><Link to='/vendor'><img src={Move}/></
        Link></li>
        </ul>
    </div>
  )
}

export default SideBar
