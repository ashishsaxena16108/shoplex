import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataView } from 'primereact/dataview';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { useLocation, Link } from 'react-router';
import Close from '../assets/close.svg'
import User from '../assets/user.svg'
import Nav from './Nav'
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
const Account = () => {
  const { user } = useSelector((state) => state.auth)
  const [change, setchange] = useState(true)
  const [wishlist, setwishlist] = useState({})
  const [orders, setorders] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {

    fetch('http://localhost:8080/shoplex/customer/showwishlist', {
      method: 'GET', headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.json())
      .then(data => { setwishlist(data) });
    setorders(user.orders)
    console.log(user)
    console.log(user.orders)
  }, [])
  const editProfile=(editForm)=>{
     fetch('http://localhost:8080/shoplex/customer/updateProfile',{method:'POST',
     body:editForm,
     headers:{
       'Authorization': `Bearer ${localStorage.getItem('token')}`
     }})
  }
  const editHandler = (e)=>{
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);
        let file = formData.get('profileImageUrl');
        formData.delete('profileImageUrl');
        let data = Object.fromEntries(formData.entries());
        let editForm = new FormData();
        editForm.append('file',file);
        editForm.append('user',JSON.stringify(data))
        editProfile(editForm);
  }
  const itemTemplate = (product, index) => {
    return <div key={product.id} className='w-1/2 m-7'><Link to={`/product/${product.id}`}>
      <div className="product flex gap-12 w-full justify-around bg-gray-200 p-3 rounded-lg">
        <img className="rounded-lg" src={product.imageUrl} width="180" alt="" />
        <div className='w-1/2 translate-y-8'>
          <h1 className='text-4xl'>{product.name}</h1>
          <p className='text-lg'>{product.category},{product.brand}</p>
        </div>
      </div>
    </Link>
    </div>
  }
  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;
    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    })
    return <div className="grid grid-nogutter gap-4">{list}</div>;
  }
  const orderItemlistTemplate = (products) =>{
      if(!products || products.length === 0) return null;
      let list = products.map((orderitem,index)=>{
        let product = orderitem.vendorProduct.product;
        return <div key={product.id} className='w-1/2 m-7 bg-transparent'>
          <div className="product flex gap-12 w-full justify-around bg-gray-200 p-3 rounded-lg">
            <img className="rounded-lg" src={product.imageUrl} width="200" alt="" />
          </div>
        </div>
      })
      return <div className="grid grid-nogutter gap-4 bg-gray-200">{list}</div>;
  }
  const orderTemplate = (order, index) => {
    return <div className="product flex gap-12 w-full bg-gray-200 p-3 rounded-lg">
      <div className='flex flex-col gap-5 m-3'>
        <h1 className='text-2xl'>Order Id: {order.id}</h1>
        <h1 className='text-2xl'>Order Date: {order.createdAt.split('T')[0]}</h1>
        <h1 className='text-2xl'>Order Status:<span className=' bg-blue-500 rounded-xl p-2 m-2 text-white'>{order.orderStatus}</span></h1>
        <h1 className='text-2xl'>Total Price: {new Intl.NumberFormat('hi-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount)}</h1>
      </div>
      <div>
      <h1 className='text-3xl'>Order Items:</h1>
        <DataView value={order.orderItems} listTemplate={orderItemlistTemplate}/>
    </div>
    </div>
  }
  const orderlistTemplate = (orders) => {
    if (!orders || orders.length === 0) return null;
    let list = orders.map((order, index) => {
      return orderTemplate(order, index);
    })
    return <div className="grid grid-nogutter gap-4 m-3">{list}</div>;
  }
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-700 flex items-center justify-center ">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-lg p-6 w-[600px] h-[450px]"
          >
          <img className='absolute top-2 right-2' src={Close} alt="" onClick={()=>setIsOpen(false)}/>
        <form  onSubmit={editHandler}>
        <div className='flex flex-row mt-8 max-[650px]:flex-col'>
        <div>
        <div className="form-group">
            <input type="text" id="firstname" name="firstName" className='border-2 rounded-lg m-2 p-2' placeholder='First Name' value={user.firstName}/>
          </div>
          <div className="form-group">
            <input type="text" id="lastname" name="lastName" className='border-2 rounded-lg m-2 p-2' placeholder='Last Name' value={user.lastName}/>
          </div>
          <div className="form-group">
            <input type="number" id="number" name="phoneNumber" className='border-2 rounded-lg m-2 p-2' placeholder='Phone Number' value={user.phoneNumber}/>
          </div>
          <div className="form-group">
            <input type="text" id="address" name="address" className='border-2 rounded-lg m-2 p-2' placeholder='Address' value={user.address} />
          </div>
          <div className="form-group">
            <input type='file' id="profileImage" name="profileImageUrl" className='border-2 rounded-lg m-2 p-2'  />
          </div>
          </div>
          <div>
          <div className="form-group">
            <input type="email" id="email" name="email" className='border-2 rounded-lg m-2 p-2' placeholder='Email' value={user.email} />
          </div>
          </div>
          </div>
          <div className='flex justify-center items-center'>
          <button role='submit' className=' bg-blue-500 text-white rounded-xl w-40 h-16 m-3 text-2xl'>Save profile</button>
          </div>
          </form>
          </motion.div>
        </div>)}
      <div className='flex p-8 flex-col gap-6'>
        <div className='flex justify-center items-center p-8 flex-col gap-6'>
          <div className='border rounded-full flex justify-center items-center w-64 h-64'>
            <img className='w-60 h-60 object-contain rounded-full' src={user?.profileImageUrl === null ? User : user?.profileImageUrl} alt="" />
          </div>
          <h1 className="text-5xl">{user.firstName} {user?.lastName}</h1>
          <h1 className='text-2xl'>{user?.email}</h1>
          <button onClick={() => setIsOpen(true)} className=' h-14 w-28 rounded-lg bg-white border border-black text-black text-xl'>Edit Profile</button>
        </div>
        <div>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-5 text-3xl'>
              <h1 className='cursor-pointer' onClick={() => setchange(!change)}>Your Wishlist</h1>
              <h1 className='cursor-pointer' onClick={() => setchange(!change)}>Your Orders</h1>
            </div>
            <div className={`h-0.5 rounded-lg  bg-black w-42 ${change ? 'ml-1 translate-x-0' : 'ml-2 translate-x-44'}`}></div>
          </div>
          <div>
            {change ?
              <DataView value={wishlist?.products} listTemplate={listTemplate} />
              : <div>
                <DataView value={orders} listTemplate={orderlistTemplate} />
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
