import React from 'react'
import { Link,useNavigate } from 'react-router'
import { useDispatch,useSelector } from 'react-redux';
import { login, logout } from '../feature/auth/authSlice';
const LogIn = ({role}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  async function logIn(data){
    if(role === 'ADMIN'){
        fetch('http://localhost:8080/shoplex/auth/signin/admin', { method: 'POST',body: JSON.stringify(data) ,headers: { 'Content-Type': 'application/json'}})
        .then(res => {
            if(res.error){
                alert(res.error)
            }
            else{
              localStorage.setItem('token',res.token)
              dispatch(login({role:'ADMIN',user:res.user}))
              navigate('/home')
            }
            
        })
    }
    else{
        const res = await fetch('http://localhost:8080/shoplex/auth/signin/user', { method: 'POST',body: JSON.stringify(data),headers: { 'Content-Type': 'application/json'}})
        const resp = await res.json()
          if(resp.error){
            alert(resp.error)
          }
          else{
          localStorage.setItem('token',resp.token)
          if(resp.user.role==='VENDOR'){
            dispatch(login({role:'VENDOR',user:resp.user}))
            navigate('/vendor')
          }
          else if(resp.user.role=='DELIVERY_PERSONNEL'){
            dispatch(login({role:'DELIVERY_PERSONNEL',user:resp.user}))
            navigate('/delivery')
          }
          else{
            dispatch(login({role:'USER',user:resp.user}))
            navigate('/')
          }
        }
    }
  }
  function handleForm(e){
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());
    logIn(data);
  }
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className="form border-2 border-transparent bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 w-[350px] mx-auto h-[450px] p-[3px] rounded-lg flex justify-center items-center">
      <div className='flex flex-col gap-4 justify-center items-center text-2xl h-full w-[345px] bg-white rounded-lg'>
        <h1 className='text-4xl'>Log In</h1>
        <form className='flex flex-col gap-4 justify-center items-center' onSubmit={handleForm}>
          <div className="form-group">
            <input type="email" id="email" name="email" className='border-2 rounded-lg m-2 p-2' placeholder='Email' />
          </div>
          <div className="form-group">
            <input type="password" id="password" name="password" placeholder='Password' className='border-2 rounded-lg m-2 p-2' />
          </div>
          <button type="submit" className='bg-gradient-to-r from-green-500 via-blue-400 to-cyan-400 w-28 h-12 rounded-full flex justify-center items-center text-white p-[3px]'>Log In</button>
          <div className='flex flex-col text-[16px] justify-center items-center'><div>Don't Have An Account?</div><div className=' text-blue-800'><Link to='/vendor/signin'>Sign In</Link></div></div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default LogIn
