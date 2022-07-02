import React from 'react'
import { Link } from 'react-router-dom'
import searchImg from "../../search.png" 
import './NavBar.css'

const NavBar = props => {

  function logoutHandler(){
    localStorage.removeItem("user")
    props.setToken(null)
  }  

  let notLoggedNav = (
    <>
        <Link to="/" className='logo-div'>
            Blueit
        </Link>

        <form className='search-form'>
            <input type="search" placeholder='Search' className='search-input'/>
            <button type="submit" className="search-button">
                <img src={searchImg}/>
            </button>
        </form>
        <div className='nav-buttons'>
            <Link to="/login" className='nav-button-login' onClick={()=>props.setIsLogin(true)}>
                Log In 
            </Link>
            <Link to="/signup" className='nav-button-signup' onClick={()=>props.setIsLogin(false)}>
                Sign Up
            </Link>
        </div>
    </>    
  )      

  let loggedNav = (

    <>
        <Link to="/" className='logo-div'>
            Blueit
        </Link>

        <form className='search-form'>
            <input type="search" placeholder='Search' className='search-input'/>
            <button type="submit" className="search-button">
                <img src={searchImg}/>
            </button>
        </form>
        <div onClick={logoutHandler} className='logout-btn'>logout</div>
    </>

  )

  return (
    <div className='nav-div'>
        {!props.token ? notLoggedNav : loggedNav}
    </div>
  )
}



export default NavBar