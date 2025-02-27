import React from 'react'
import { Link,useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
const SignIn = ({ role }) => {
  const navigate = useNavigate()
  function signIn(data){
    if(role === 'ADMIN'){
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/signup/admin`, { method: 'POST',body: JSON.stringify(data),headers: { 'Content-Type': 'application/json'}})
    }
    else{
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/signup/user`, { method: 'POST',body: JSON.stringify(data),headers: { 'Content-Type': 'application/json'}})
        .then(res => {
          if(role==="VENDOR")
          navigate('/vendor/login')
          else if(role==="DELIVERY_PERSONNEL")
          navigate('/delivery/login')
          else
          navigate('/login')
      })
    }
  }
    function handleForm(e){
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);
        let data = Object.fromEntries(formData.entries());
        data.role = role;
        signIn(data);
      }
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className="form border-2 border-transparent bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 w-[650px] mx-auto h-[600px] p-[3px] rounded-lg flex justify-center items-center">
      <div className='flex flex-col gap-4 justify-center items-center text-2xl h-full w-[645px] bg-white rounded-lg'>
        <h1 className='text-4xl'>Sign In</h1>
        <div>
        <form className='flex flex-col gap-4 justify-center items-center' onSubmit={handleForm}>
        <div className='flex flex-row max-[650px]:flex-col'>
        <div>
        <div className="form-group">
            <input type="text" id="firstname" name="firstName" className='border-2 rounded-lg m-2 p-2' placeholder='First Name' />
          </div>
          <div className="form-group">
            <input type="text" id="lastname" name="lastName" className='border-2 rounded-lg m-2 p-2' placeholder='Last Name' />
          </div>
          <div className="form-group">
            <input type="number" id="number" name="phoneNumber" className='border-2 rounded-lg m-2 p-2' placeholder='Phone Number' />
          </div>
          </div>
          <div>
          <div className="form-group">
            <input type="email" id="email" name="email" className='border-2 rounded-lg m-2 p-2' placeholder='Email' />
          </div>
          <div className="form-group">
            <input type="password" id="password" name="password" placeholder='Create Password' className='border-2 rounded-lg m-2 p-2' />
          </div>
          </div>
          </div>
          <button type="submit" className='bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 w-28 h-12 rounded-full flex justify-center items-center text-white p-[3px]'>Sign In</button>
          <div className='flex flex-col text-[16px] justify-center items-center'><div>Already Have An Account?</div><div className=' text-blue-800'><Link to='/vendor/login'>Log In</Link></div></div>
        </form>
        </div>
        
        </div>
      </div>
    </div>
  )
}

export default SignIn
