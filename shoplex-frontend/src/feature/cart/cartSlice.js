import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart:{items: []},
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { vendorProduct, quantity } = action.payload
      const existingIndex = state.cart.items.findIndex((item) => item.vendorProduct.id === vendorProduct.id)
      if (existingIndex !== -1) {
        state.cart.items[existingIndex].quantity = quantity
      } else {
        state.cart.items.push({ vendorProduct, quantity })
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.cart.items = state.cart.items.filter((item) => item.vendorProduct.id !== productId)
    },
    setCart: (state, action) => {
      if (action.payload && action.payload.items) {
        state.cart.items = action.payload.items
      }
      console.log(state.cart)
    },
  },
})

export const { addToCart, removeFromCart, setCart } = cartSlice.actions
export default cartSlice.reducer