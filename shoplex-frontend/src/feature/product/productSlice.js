import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    products: new Array(0),
}
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload.products;
        },
    },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;