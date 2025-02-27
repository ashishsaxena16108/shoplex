import React,{ useState,useEffect } from 'react'
import Minus from '../assets/minus.svg'
import Plus from '../assets/plus.svg'
import Emptyheart from '../assets/emptyheart.svg' 
import Fillheart from '../assets/fillheart.svg'
import { toast,Bounce } from 'react-toastify'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
const Card = ({product,inwish=false}) => {
    const [addwish, setaddwish] = useState(inwish)
    const { loggedIn } = useSelector((state)=>state.auth)
    const handleWishlist = (id) => {
       if(loggedIn){
          fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/customer/addtowishlist`,{
            method:'POST',body:id,headers:{
               'Content-Type':'application/json',
               'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
          })
          setaddwish(true)
       }
       else{
        toast('Please log in for adding product to wishlist', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          });
       }
    }
  return (
    <div className='flex flex-col justify-center items-center h-[600px] p-2 w-[400px] m-4 rounded-lg bg-white text-black relative shadow-sm font-mono'>
      <div className='rounded-full bg-white p-2 absolute right-2 top-2' onClick={()=>handleWishlist(product.id)}><img src={(addwish||inwish)?Fillheart:Emptyheart} alt="" /></div>
      <div className="img ">
      <Link to={`/product/${product.id}`}><img width={390} src={product.imageUrl} alt="" className=' w-[420px] h-[500px] object-cover' /></Link>
      </div>
      <div className="content w-full">
            <h1 className=' font-bold text-3xl'>{product.name}</h1>
            <p className='w-full truncate'>{product.description}</p>
            <h2 className=' font-semibold text-2xl flex gap-5 justify-between'><span>Price:{product.minPrice}Rs.</span>{product.vendorProducts.length===1?<span></span>:<span className=' text-lg'>+{product.vendorProducts.length-1} more prices</span>}</h2>
      </div>
        
    </div>
  )
}

export default Card
