import React,{ useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { setRole } from '../feature/auth/authSlice'
const Main = () => {
  const { loggedIn } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const heads = ['Products','Customers','Vendors','Delivery Agents','Orders']
  const [change, setchange] = useState(0)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [vendors, setVendors] = useState([])
  const [orders, setOrders] = useState([])
  const [deliveryagents, setDeliveryagents] = useState([])
  useEffect(() => {
      dispatch(setRole('ADMIN'))
  }, [])
  const getProducts = async () => {
     fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/home/products`, { method: 'GET',headers: { 'Content-Type': 'application/json'}})
     .then(res => res.json())
     .then(data => setProducts(data))
  }
  const getCustomers = async () => {
     fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/admin/customers`, { method: 'GET',headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
     }})
     .then(res => res.json())
     .then(data => setCustomers(data))
  }
  const getVendors = async () => {
     fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/admin/vendors`, { method: 'GET',headers: { 'Content-Type': 'application/json',
     'Authorization': `Bearer ${localStorage.getItem('token')}`
      }}).then(res => res.json())
     .then(data => setVendors(data))
    }
  const getOrders = async () => {
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/admin/orders`, { method: 'GET',headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      }}).then(res => res.json())
     .then(data => setOrders(data))
  }
  const getDeliveryAgents = async () => {
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/admin/deliveryagents`, { method: 'GET',headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
      }}).then(res => res.json())
     .then(data => setDeliveryagents(data))
  }
  useEffect(() => {
    getProducts()
    getCustomers()
    getVendors()
    getOrders()
    getDeliveryAgents()
  }, [])
  const img = (product) =>{
    return <img src={product?.imageUrl} width={180} alt="product" />
  }
  const availability = (availability) =>{
      return availability ? <div className='bg-green-500 rounded-lg text-white w-20 text-center'>In Stock</div> : <div className='w-20 bg-red-500 rounded-lg text-white text-center'>Out Of Stock</div>
    }
    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2 bg-gray-400">
        </div>
    );
    const name = (customer) =>{
        return <div>{customer.firstName} {customer.lastName}</div>
    }
    const footer = ()=>{
      let length=0;
      if(change==0) length = products.length;
      if(change==1) length = customers.length;
      if(change==2) length = vendors.length;
      if(change==3) length = deliveryagents.length;
      if(change==4) length = orders.length;
      return (<div className=' text-2xl m-3 font-bold'>{`In total there are ${length}`} {heads[change].toLocaleLowerCase()}.</div>);
      const orderFooter = (<div className=' text-2xl m-3 font-bold'>{`In total there are ${orders ? orders.length : 0} orders.`}</div>)};
  return (
    loggedIn ?
    <div className='flex flex-col'>
        <div className='flex flex-row text-4xl gap-4 m-6'>
        <h1 className={`cursor-pointer p-4 rounded-lg ${change==0?' text-gray-600':'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white'}`} onClick={()=>setchange(0)}>{heads[0]}</h1>
        <h1 className={`cursor-pointer p-4 rounded-lg ${change==1?' text-gray-600':'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white'}`} onClick={()=>setchange(1)}>{heads[1]}</h1>
        <h1 className={`cursor-pointer p-4 rounded-lg ${change==2?' text-gray-600':'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white'}`} onClick={()=>setchange(2)}>{heads[2]}</h1>
        <h1 className={`cursor-pointer p-4 rounded-lg ${change==3?' text-gray-600':'bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 text-white'}`} onClick={()=>setchange(3)}>{heads[3]}</h1>
        </div>
        <div className='flex justify-center items-center'>
          {change==0 && <div>
           <DataTable value={products} footer={footer} tableStyle={{ width: '100rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize: '20px' }} header={header}>
                     <Column field='name' header="Name" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
                     <Column field="description" header="Description" style={{padding:'10px',width:'600px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column field="price" header="Price" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column field="quantity" header="Quantity" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column body={img} header="Image" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column field="category" header="Category" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column field="brand" header="Brand" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                     <Column body={availability} header="Availability" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopRightRadius:'10px'}}></Column>
                   </DataTable>
          </div>}
          {change==1 && <div>
            <DataTable value={customers} footer={footer} tableStyle={{ width: '100rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize: '20px' }} header={header}>
            <Column body={name} header="Name" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="email" header="Email" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="phoneNumber" header="Phone Number" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="address" header="Address" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            </DataTable>
          </div>}
          {change==2 && <div>
            <DataTable value={vendors} footer={footer} tableStyle={{ width: '100rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize: '20px' }} header={header}>
            <Column body={name} header="Name" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="email" header="Email" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="phoneNumber" header="Phone Number" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="address" header="Address" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            </DataTable>
          </div>}
          {change==3 && <div>
            <DataTable value={deliveryagents} footer={footer} tableStyle={{ width: '100rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize: '20px' }} header={header}>
            <Column body={name} header="Name" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="email" header="Email" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="phoneNumber" header="Phone Number" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            <Column field="address" header="Address" style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}></Column>
            </DataTable>
          </div>}
        </div>
    </div> :
    <div className='flex justify-center items-center'>
      <h1 className='text-3xl font-bold text-center text-gray-400 mt-80'>Please sign in to access the admin panel.</h1>
    </div>
  )
}

export default Main
