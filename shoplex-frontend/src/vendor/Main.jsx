import React,{ useState,useEffect } from 'react'
import Nav from '../components/Nav'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { button, div } from 'framer-motion/client';
const Main = () => {
  const { loggedIn } = useSelector((state)=>state.auth)
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [product,setProduct] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const getProducts = () => {
    fetch('http://localhost:8080/shoplex/vendor/myproducts', { method: 'GET',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .then(res => res.json())
    .then(data => {setMyProducts(data)
    })
  }
  const getOrders = () => {
    fetch('http://localhost:8080/shoplex/vendor/myorders', { method: 'GET',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setMyOrders(data)})
  }
  useEffect(() => {
    getProducts()
    getOrders()
  }, [])
  

  const img = (product) =>{
    return <img src={product.product?.imageUrl} width={180} alt="product" />
  }
  const availability = (availability) =>{
    return availability ? <div className='bg-green-500 rounded-lg text-white w-20 text-center'>In Stock</div> : <div className='w-20 bg-red-500 rounded-lg text-white text-center'>Out Of Stock</div>
  }
  const edit = (product) =>{
    return <button className='p-2 bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 rounded-lg text-white w-14 cursor-pointer hover:scale-110' onClick={()=>{
      setOpenForm(true)
      setProduct(product)
    }}>Edit</button>
  }
  const deleteProduct = (product) =>{
    return <button className=' bg-red-600 rounded-lg p-2 text-white w-20 cursor-pointer hover:scale-110' >Delete</button>
  }
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2 bg-gray-400">
    </div>
);
  const footer = (<div className=' text-2xl m-3 font-bold'>{`In total there are ${myProducts ? myProducts.length : 0} ${!isChange?'products':'orders'}.`}</div>);
  const orderFooter = (<div className=' text-2xl m-3 font-bold'>{`In total there are ${myOrders ? myOrders.length : 0} ${!isChange?'products':'orders'}.`}</div>);
  const productName=(order)=>{
      return (<div className='flex flex-col gap-0 h-[150px] overflow-y-scroll scrollbar-hide'>
      {order.orderItems.map((item,index)=>{
         return <div key={index} className=' bg-emerald-300 m-2 p-3 rounded-lg text-xl font-bold'>
                <h1>Product: {item.productName}</h1>
                <h1>Quantity: {item.quantity}</h1></div>
      })}
      </div>)
  }
  const status = (order) =>{
     return <button className=' bg-emerald-800 rounded-xl text-white p-3'>{order.orderStatus}</button>
  }
  const handleStatus = (order)=>{
       fetch(`http://localhost:8080/shoplex/vendor/updateorderstatus?orderId=${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}}).then(res=>res.json()).then(data=>console.log(data))
  }
  const ready = (order) =>{
    return (order.orderStatus!=='PROCESSING' ? <button className=' bg-emerald-600 rounded-xl text-white p-3' onClick={()=>handleStatus(order)}>Ready To Ship</button> : <div></div>)
  }
  return (
    <div>
      
      { loggedIn ?
      <div className="flex flex-col justify-center items-center gap-6">
       <div className="head text-3xl self-start m-4 flex flex-row gap-5">
        <h1 className={`p-4 rounded-lg ${isChange?' text-gray-600':'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white'}`} onClick={()=>{setIsChange(!isChange)}}>Your Products</h1>
        <h1 className={`p-4 rounded-lg ${isChange?'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white':'text-gray-600 text-gray-'}`} onClick={()=>{setIsChange(!isChange)}}>Your Orders</h1>
      </div>
      {!isChange ? 
       <div>
        <DataTable value={myProducts} footer={footer} header={header} tableStyle={{ minWidth: '90rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize
        : '20px' }}>
          <Column field='product.name' header="Name" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
          <Column field="product.description" header="Description" style={{padding:'10px',width:'600px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column field="price" header="Price" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column field="quantity" header="Quantity" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column body={img} header="Image" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column field="product.category" header="Category" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column field="product.brand" header="Brand" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column body={availability} header="Availability" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column body={edit} style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
          <Column body={deleteProduct} style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopRightRadius:'10px'}}></Column>
        </DataTable>
        <Link to='/vendor/addproduct'><button className='bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white rounded-lg p-4'>Add New Product</button></Link>
        </div>
        : <div>
        <DataTable value={myOrders} footer={orderFooter} header={header} tableStyle={{ minWidth: '90rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize
        : '20px' }}>
          <Column body={productName} header='Product Name' style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}/>
          <Column body={(order)=>order.createdAt.split('T')[0]} header='Placed At' style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}/>
          <Column field='totalAmount' header='Total Amount' style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}/>
          <Column body={status} header='Status' style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}/>
          <Column body={ready} style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopRightRadius:'10px'}}/>
        </DataTable>
        </div>}
      </div>
      : <div className='flex justify-center items-center text-2xl text-gray-400 mt-[200px]'>Please Sign In To Manage Your Products</div>
      }
    </div>
  )
}

export default Main
