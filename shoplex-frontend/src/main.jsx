import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Home'
import Main from './vendor/Main'
import MainDeli from './delivery/Main'
import MainAdmin from './admin/Main'
import Login from './vendor/LogIn'
import SignIn from './vendor/SignIn'
import Form from './components/Form'
import Account from './components/Account'
import Product from './components/Product'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './app/store'
import Order from './components/Order'
import LogIn from './vendor/LogIn'
const router = createBrowserRouter([
  {path:'/',element:<App/>,
    children:[
      {path:'',element:<Home/>},
      {path:'login',element:<Login role="USER"/>},
  {path:'signin',element:<SignIn role="USER"/>},
  {path:'vendor',element:<Main/>},
  {path:'vendor/login',element:<Login role="VENDOR"/>},
  {path:'vendor/signin',element:<SignIn role="VENDOR"/>},
  {path:'delivery/login',element:<LogIn role="DELIVERY_PERSONNEL"/>},
  {path:'delivery/signin',element:<SignIn role="DELIVERY_PERSONNEL"/>},
  {path:'delivery',element:<MainDeli/>},
  {path:'admin',element:<MainAdmin/>},
  {path:'admin/login',element:<LogIn role="ADMIN"/>},
  {path:'admin/signin',element:<SignIn role="ADMIN"/>},
  {path:'vendor/addproduct',element:<Form/>},
  {path:'account',element:<Account/>},
  {path:'product/:pid',element:<Product/>},
  {path:'order',element:<Order/>}
    ]
  }
  ]
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
