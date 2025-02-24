import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const Main = () => {
const { loggedIn } = useSelector((state)=>state.auth)
const [myOrders, setmyOrders] = useState([])
const getOrders = () => {
    fetch('http://localhost:8080/shoplex/delivery/myorders',{headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    .then(res=>res.json)
    .then(data=>setmyOrders(data))
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
       fetch(`http://localhost:8080/shoplex/delivery/mark-order-shipping/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }
    else if(order.orderStatus==='SHIPPING'){
      fetch(`http://localhost:8080/shoplex/delivery/mark-order-out-for-delivery/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }
    else if(order.orderStatus==='OUT_FOR_DELIVERY'){
      fetch(`http://localhost:8080/shoplex/delivery/mark-order-delivered/${order.orderId}`,{method:'POST',headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${localStorage.getItem('token')}`}})
    }

}
const changeStatusBtn = (order)=>{
  let status = order.orderStatus
  return <button onClick={()=>changeStatus(order)}>Mark {status}</button>
}
  return (
    <div>
      {
        loggedIn?
        <div>
            <div><h1>Your Orders</h1></div>
            <div>
                <DataTable value={myOrders}>
                    <Column body={showProducts} header='Products'>
                    </Column>
                    <Column header='User Address' field='userAdress'></Column>
                    <Column header='Vendor Address' field='vendorAddress'></Column>
                    <Column header='Total Amount' field='totalAmount'></Column>
                    <Column header='Placed At' body={(order)=>order.createdAt.split('T')[0]}></Column>
                    <Column header='Status' field='status'></Column>
                    <Column body={changeStatus}>
                    </Column>
                </DataTable>
            </div>
        </div>
        :
        <div>Please login to manage your deliveries</div>
      }
    </div>
  )
}

export default Main
