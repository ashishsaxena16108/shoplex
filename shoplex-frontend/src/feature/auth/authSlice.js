import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedIn: false,
  role: null,
  user:{}
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.loggedIn = true
      state.role = action.payload.role
      state.user=action.payload.user
    },
    logout: (state) => {
      state.loggedIn = false
      state.role = null
      state.user={}
    },
    setRole:(state,action)=>{
        state.role=action.payload.role
    }
  },
})

export const { login, logout, setRole } = authSlice.actions
export default authSlice.reducer