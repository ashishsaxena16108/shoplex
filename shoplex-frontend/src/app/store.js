import { configureStore } from "@reduxjs/toolkit";
import authReducer  from '../feature/auth/authSlice'
import cartReducer from '../feature/cart/cartSlice'
import productReducer from '../feature/product/productSlice'
export const store = configureStore({
    reducer: {
    auth: authReducer,
    cart: cartReducer,
    product:productReducer,
  },
})