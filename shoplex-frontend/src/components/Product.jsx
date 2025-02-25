import React,{ useState,useEffect,useContext } from 'react'
import Nav from './Nav'
import { useParams,useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../feature/cart/cartSlice'
const Product = () => {
 const { pid } = useParams()   
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const [product, setproduct] = useState({})
 const [availability, setAvailability] = useState(false)
 const handleAddToCartBtn = (vp)=>{
    vp={...vp,product}
    dispatch(addToCart({vendorProduct:vp,quantity:1}))
    toast.success('Added To Cart', {
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
    navigate('/')
 }
  useEffect(() => {
    fetch(`http://localhost:8080/shoplex/home/product/${pid}`)
    .then(res=>res.json())
    .then(json=>{
    const minPrice=Math.min(...json.vendorProducts?.map(vp => vp.price))
    const isAvailable = json.vendorProducts?.some(vp => vp.quantity > 0)
    let updatedProduct={...json,minPrice}
    setproduct(updatedProduct)
    setAvailability(isAvailable)
    })
  }, [])
  
  return (
    <div>
      <div className='flex flex-col m-7'>
      <section className='flex' id='main'>
      <img width={640} src={product.imageUrl} alt="" />
      <div className='m-7 flex flex-col'>
      <h1 className=' m-4 text-5xl font-extrabold'>{product.name}</h1>
      <h1></h1>
      <h1 className=' m-4 text-3xl'>{availability?<span className='text-green-600'>In Stock</span>:<span className=' text-red-500'>Out Of Stock</span>}</h1>
      <h1 className=' m-4 text-4xl'>Rs.{product.minPrice}</h1>
      </div>
      </section>
      <section id='details' className='mb-18'>
        <h1 className='text-5xl font-extrabold'>Product Details</h1>
        <div className='w-4/10 text-2xl'>
        <div className='h-1 bg-gray-500 my-6'></div>
        <div className='flex justify-between m-3'>
            <h5 className='font-bold'>Category</h5>
            <h5>{product.category}</h5>
        </div>
        <div className='h-1 bg-gray-500 my-6'></div>
        <div className='flex justify-between m-3'>
            <h5 className='font-bold'>Brand</h5>
            <h5>{product.brand}</h5>
        </div>
        <div className='h-1 bg-gray-500 my-6'></div>
        <div className='flex justify-between m-3'>
            <h5 className='font-bold'>Weight</h5>
            <h5>{product.weight}</h5>
        </div>
        <div className='h-1 bg-gray-500 my-6'></div>
        <div className='flex justify-between m-3'>
            <h5 className='font-bold'>Dimensions</h5>
            <h5>{product.dimensions?product.dimensions:"Not Specified"}</h5>
        </div>
        </div>
      </section>
      <section className='w-3/5'>
        <h1 className='text-5xl font-extrabold'>Vendors who are selling this product</h1>
        <div className='h-1 bg-gray-500 my-6'></div>
        {product.vendorProducts?.map((vp,index)=>{
            return <div key={index} className='text-3xl'>
              <div className='m-7 flex justify-around'>
              <div>
               <h1 className='text-5xl font-bold'>Rs.{vp.price}</h1>
               <h1 className='my-4'>{vp.vendor.firstName} {vp.vendor.lastName}</h1>
               <h1 className='my-4'>{vp.quantity>0?<span className='text-green-500'>In Stock</span>:<span className='text-red-500'>Out Of Stock</span>}</h1>
               </div>
               <div><button className=' bg-cyan-400 rounded-full h-18 text-white w-52 my-4 cursor-pointer' onClick={()=>handleAddToCartBtn(vp)}>Add To Cart</button></div>
               </div>
               <div className='h-1 bg-gray-500 my-6'></div>
            </div>
        })}
      </section>
      <section className='flex flex-row justify-between w-3/5'>
      <div className='flex flex-row gap-7'>
       <div>
        <h1 className='text-5xl font-extrabold'>Customer reviews</h1>
        <h1>{[...Array(5).map((_,index)=>{
           if(index<product.avgRating)
             return <i>★</i>
           else
             return <i>☆</i>
        }
        )]}</h1>
        <div><button className='text-2xl rounded-xl border-4 font-semibold bg-gray-200 border-black p-2 m-7'>Write a product review</button></div>
        </div>
        <div className='w-0.5 bg-black'></div>
      </div>
      <div>
        <h1 className='text-5xl font-extrabold flex justify-between'><span>Reviews & Ratings</span></h1>
        {product.reviewsAndRatings>0?
        product.reviewsAndRatings.map((rar)=>{
          return <div></div>
        })
        :<h1 className='text-4xl m-8 text-gray-500'>Be the first one to review</h1>}
      </div>
      </section>
      </div>
    </div>
  )
}

export default Product
