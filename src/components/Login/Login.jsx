import React, {useState} from 'react'
import './Login.css'
import sideImg from '../../login-side.png'

import { login, signUp } from '../../api/users'
import { useNavigate } from 'react-router-dom'
import {Input} from 'antd'
import { CopyrightCircleFilled } from '@ant-design/icons'

const Login = ({setToken, setUser, isLogin, setIsLogin}) => {

  const navigate = useNavigate
  const [formData, setFormData] = useState("")
  // const [isLogin, setIsLogin] = useState(true)

  const handleLoginChange=(e)=>{

    e.preventDefault()

    setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const handleLoginSubmit = async(e)=>{
    e.preventDefault()  
    let data;
    if(!isLogin){
      data = await signUp(formData)
    }else{
      data= await login(formData)
    }

    if(data){

      localStorage.setItem(
        'user',
        JSON.stringify(data)
      )
      setToken(data.token)
      console.log(data)
      setUser({userId:data.userId, username:data.username})


    }


  }

  let logDiv = (
    <div className='login-div'>
      <img src={sideImg} />
      <div className='login-container'>
          <h3>Login</h3>
          <form className='log-form' onSubmit={handleLoginSubmit}>
              <input placeholder="Email" type="text" name="email" onChange={handleLoginChange}/>
              <input placeholder="Password" type="text" name="password" onChange={handleLoginChange}/>
              <button type="submit">Log In</button>
          </form>
      </div>
      <div className='space'></div>
    </div>
  )

  if(!isLogin){

    logDiv=(
    <div className='login-div'>
      <img src={sideImg} />
      <div className='login-container'>
          <h3>Sign Up</h3>
          <form className='log-form' onSubmit={handleLoginSubmit}>
              <input placeholder="Email" type="text" name="email" onChange={handleLoginChange}/>
              <input placeholder="Username" type="text" name="username" onChange={handleLoginChange} />
              <input placeholder="Password" type="text" name="password" onChange={handleLoginChange}/>
              <button type="submit">Sign Up</button>
          </form>
      </div>
      <div className='space'></div>
    </div>
    )
  }

  console.log(isLogin)

  return (
    <div className='login-back'>
      {logDiv}
    </div>
  )
}

export default Login