import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const Main = () => {
const { loggedIn } = useSelector((state)=>state.auth)
const [myOrders, setmyOrders] = useState([])
const getOrders = () => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/delivery/myorders`,{method:'GET',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .then(res=>res.json())
    .then(data=>{setmyOrders(data)
      console.log(data)
    })
}
useEffect(() => {
  getOrders()
}, [])

const showProducts = (order) => {
    return <div>
        {order.orderItems.map((order,index)=>{
           return <div key={index}>
              <div><h1>{order.name}</h1>
              <h1>Quantity:{order.quantity}</h1></div>
              <div>Price:{order.price}</div>
           </div>
        })}
    </div>
}
const changeStatus = (order) => {
    if(order.orderStatus==='PROCESSING'){
       fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/delivery/mark-order-shipping/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }
    else if(order.orderStatus==='SHIPPING'){
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/delivery/mark-order-out-for-delivery/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }
    else if(order.orderStatus==='OUT_FOR_DELIVERY'){
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/delivery/mark-order-delivered/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }

}
const changeStatusBtn = (order)=>{
  let status = order.orderStatus
  return <button className=' bg-emerald-800 p-2 rounded-xl text-white' onClick={()=>changeStatus(order)}>Mark {status}</button>
}
  return (
    <div>
      {
        loggedIn?
        <div className='m-5 flex gap-5 flex-col'>
            <div><h1 className='text-5xl bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 text-transparent font-bold'>Your Orders</h1></div>
            <div className='flex justify-center items-center'>
                <DataTable value={myOrders} tableStyle={{ width: '100rem',backgroundColor: '#ffffff',borderRadius: '10px',fontSize: '20px' }}>
                    <Column body={showProducts} header='Products' style={{padding:'10px'}} headerStyle={{backgroundColor:'#d1d5dc',borderTopLeftRadius:'10px'}}>
                    </Column>
                    <Column header='User Address' field='userAddress' headerStyle={{backgroundColor:'#d1d5dc'}}></Column>
                    <Column header='Vendor Address' headerStyle={{backgroundColor:'#d1d5dc'}} field='vendorAddress' ></Column>
                    <Column header='Total Amount' headerStyle={{backgroundColor:'#d1d5dc'}} field='totalAmount'></Column>
                    <Column header='Placed At' headerStyle={{backgroundColor:'#d1d5dc'}} body={(order)=>order.createdAt.split('T')[0]}></Column>
                    <Column header='Status' headerStyle={{backgroundColor:'#d1d5dc'}} field='orderStatus'></Column>
                    <Column body={changeStatusBtn} headerStyle={{backgroundColor:'#d1d5dc',borderTopRightRadius:'10px'}}>
                    </Column>
                </DataTable>
            </div>
        </div>
        :
        <div className='flex justify-center items-center mt-40 text-5xl text-gray-300'>Please login to manage your deliveries</div>
      }
    </div>
  )
}

export default Main
