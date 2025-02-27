import React,{ useState,useEffect,useContext } from 'react'
import { motion } from 'framer-motion'
import Close from '../assets/close.svg'
import { useParams,useNavigate } from 'react-router'
import { useDispatch,useSelector } from 'react-redux'
import { toast,Bounce } from 'react-toastify'
import { addToCart } from '../feature/cart/cartSlice'
import './Product.css'
const Product = () => {
 const { pid } = useParams()   
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const { loggedIn } = useSelector((state) => state.auth)
 const [rate, setRate] = useState(0)
 const [product, setproduct] = useState({})
 const [availability, setAvailability] = useState(false)
 const [isOpen, setIsOpen] = useState(false);
 const handleReviewBtn = ()=>{
    if(loggedIn){
        setIsOpen(true)
    }
    else{
      alert('Please login to write a review')
    }
 }
 const postReview = (data)=>{
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/customer/addreview/${pid}`,{
      method:'POST',
      body:JSON.stringify(data),
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`}})
      .then(res=>res.text())
 }
 const handleReviewSubmit = (e)=>{
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    formData.append('rating',rate)
    let data = Object.fromEntries(formData.entries());
    postReview(data)
    setIsOpen(false)
 }
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
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/home/product/${pid}`)
    .then(res=>res.json())
    .then(json=>{
    const minPrice=Math.min(...json.vendorProducts?.map(vp => vp.price))
    const isAvailable = json.vendorProducts?.some(vp => vp.quantity > 0)
    const avgrating = json.reviewsAndRatings.reduce((acc, curr) => acc + curr.rating, 0) / json.reviewsAndRatings.length
    let updatedProduct={...json,minPrice,avgrating}
    setproduct(updatedProduct)
    setAvailability(isAvailable)
    })
  }, [])
  
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-700 flex items-center justify-center ">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-lg p-6 w-[600px] h-[450px] text-3xl"
          >
          <img src={Close} onClick={()=>setIsOpen(false)} alt="" />
          <form className='flex justify-between flex-col' onSubmit={handleReviewSubmit}>
           <div>
            <label htmlFor="Rating">Ratings</label>
            <div className='text-7xl text-amber-300'>
            {[...Array(5)].map((_, index) => (
            <span key={index} onClick={() => setRate(index + 1)} className='cursor-pointer'>{index < rate ? '★' : '☆'}</span>
      ))}
            </div>
           </div>
            <div className='flex flex-col'>
            <label htmlFor="reviewText">Review</label>
            <textarea name="reviewText" id="" placeholder='Write your review here' className='m-3 p-2 rounded-lg'></textarea>
            </div>
            <div className='flex justify-center items-center'><button role='submit' className=' text-white bg-blue-700 p-3 rounded-xl'>Post your review</button></div>
          </form>
          </motion.div>
          </div>
      )}
      <div className='flex flex-col m-7'>
      <section className='flex' id='main'>
      <div className=' w-[600px] h-[830px] overflow-scroll scrollbar-hide p-4 object-fill'>
      <img width={640} className=' object-center' src={product.imageUrl} alt="" /></div>
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
      <section className='flex flex-row gap-7'>
      <div className='flex flex-row gap-7'>
       <div>
        <h1 className='text-5xl font-extrabold '>Customer ratings</h1>
        <h1 className='text-5xl text-amber-500 flex '>{product.avgrating ? [...Array(5)].map((_,index)=>{
           if(index<product.avgrating)
             return <span key={index}>★</span>
           else
             return <span key={index}>☆</span>
        }
        ):<p></p>}
        {product.avgrating ? <h2 className='text-black text-3xl ml-3 mt-3'> {product.avgrating} out of 5</h2>:<p></p>}
        </h1>
        <div><button onClick={handleReviewBtn} className='text-2xl rounded-xl border-4 font-semibold bg-gray-200 border-black p-2 m-7'>Write a product review</button></div>
        </div>
        <div className='w-0.5 bg-black'></div>
      </div>
      <div className=''>
        <h1 className='text-5xl font-extrabold flex justify-between'><span>Reviews</span></h1>
        {product.reviewsAndRatings && product.reviewsAndRatings.length>0?
        product.reviewsAndRatings.map((rar)=>{
          return <div className='text-3xl m-4 flex bg-blue-300 rounded-lg p-2 w-full'>
            <h1>{rar.reviewText}</h1>
            <h1 className=' text-amber-500 text-5xl'>{rar.rating && [...Array(5)].map((_,index)=>{
           if(index<rar.rating)
             return <span key={index}>★</span>
           else
             return <span key={index}>☆</span>
        }
        )}</h1>
          </div>
        })
        :<h1 className='text-4xl m-8 text-gray-500'>Be the first one to review</h1>}
      </div>
      </section>
      </div>
    </div>
  )
}

export default Product
