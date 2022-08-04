import React, {useState} from 'react'
import './Login.css'
import sideImg from '../../login-side.png'

import { login, signUp } from '../../api/users'
import { useNavigate } from 'react-router-dom'
import {Input} from 'antd'
import { CopyrightCircleFilled } from '@ant-design/icons'

const Login = ({setToken, setUser, isLogin, setIsLogin}) => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState("")
  const [inputErrors, setInputErrors] = useState({email:false, username:false, password: false})
  // const [isLogin, setIsLogin] = useState(true)
  const handleLoginChange=(e)=>{

    e.preventDefault()

    setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const handleLoginSubmit = async(e)=>{
    e.preventDefault()  
    let data;
    if(!isLogin){
      console.log("Tis me")
      console.log(formData)
      data = await signUp(formData)
    }else{
      data= await login(formData)
      console.log(data)
    }
    
    
    if(data && !data.errors){
      console.log("does if data run")
      localStorage.setItem(
        'user',
        JSON.stringify(data)
      )
      setToken(data.token)
      console.log(data)
      setUser({userId:data.userId, username:data.username})
      navigate("/")  

    }else if(!data.isValid){
      console.log("Psych it was else")
      setInputErrors(data.errors)
    }


  }

  // let logDiv = (
  //   <div className='login-div'>
  //     <img src={sideImg} />
  //     <div className='login-container'>
  //         <h3>Login</h3>
  //         <form className='log-form' onSubmit={handleLoginSubmit}>
  //             <input placeholder="Email" type="text" name="email" onChange={handleLoginChange}/>
  //             <input placeholder="Password" type="text" name="password" onChange={handleLoginChange}/>
  //             <button type="submit">Log In</button>
  //         </form>
  //     </div>
  //     <div className='space'></div>
  //   </div>
  // )

  // let logDiv=(
  //   <div className='login-div'>
  //     <img src={sideImg} />
  //     <div className='login-container'>
  //         <h3>{isLogin ? Login : SignUp}</h3>
  //         <form className='log-form' onSubmit={handleLoginSubmit}>
  //             <input placeholder="Email" type="text" name="email" onChange={handleLoginChange} className={inputErrors.email ? "error-style" : "log-inputs"} />
  //             {inputErrors.email ? <div className='error-text'>{inputErrors.email}</div> : null}
  //             {!isLogin ? (
  //               <>
  //               <input placeholder="Username" type="text" name="username" onChange={handleLoginChange} className={inputErrors.username ? "error-style" : "log-inputs"} />
  //               {inputErrors.username ? <div className='error-text'>{inputErrors.username}</div> : null}
  //               </>
  //               ) : null}              
  //             <input placeholder="Password" type="text" name="password" onChange={handleLoginChange} className={inputErrors.password ? "error-style" : "log-inputs"}/>
  //             {inputErrors.password ? <div className='error-text'>{inputErrors.password}</div> : null}
  //             <button type="submit">{isLogin ? Login : SignUp}</button>
  //         </form>
  //     </div>
  //     <div className='space'></div>
  //   </div>
  //   )
  console.log(inputErrors)
  return (
    <div className='login-back'>
      <div className='login-div'>
        <img src={sideImg} />
        <div className='login-container'>
            <h3>{isLogin ? "Login" : "SignUp"}</h3>
            <form className='log-form' onSubmit={handleLoginSubmit}>
                <input placeholder="Email" type="text" name="email" onChange={handleLoginChange} className={inputErrors.email ? "error-style" : "log-inputs"} />
                {inputErrors.email ? <div className='error-text'>{inputErrors.email}</div> : null}
                {!isLogin ? (
                  <>
                  <input placeholder="Username" type="text" name="username" onChange={handleLoginChange} className={inputErrors.username ? "error-style" : "log-inputs"} />
                  {inputErrors.username ? <div className='error-text'>{inputErrors.username}</div> : null}
                  </>
                  ) : null}              
                <input placeholder="Password" type="password" name="password" onChange={handleLoginChange} className={inputErrors.password ? "error-style" : "log-inputs"}/>
                {inputErrors.password ? <div className='error-text'>{inputErrors.password}</div> : null}
                <button type="submit">{isLogin ? "Login" : "SignUp"}</button>
            </form>
        </div>
        <div className='space'></div>
      </div>
    </div>
  )
}

export default Login