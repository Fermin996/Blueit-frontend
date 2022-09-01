import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchPost } from '../../api/posts'
import searchImg from "../../search.png" 
import { UserOutlined } from '@ant-design/icons'
import './NavBar.css'

const NavBar = props => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState("")
    
  function logoutHandler(){
    localStorage.removeItem("user")
    props.setToken(null)
  }  

  const handleSearchInput=(e)=>{
    setSearchText(e.target.value)
  }

  const handleSearchSubmit=async(e)=>{
    e.preventDefault()


    let searchResults
    try{
        searchResults = await searchPost(searchText)
    }catch(err){
        console.log(err)
    }

    props.setCurrPosts({page:[...searchResults]})

    navigate("/search-results")

  }


  let notLoggedNav = (
        <div className='nav-buttons'>
            <Link to="/login" className='nav-button-login' onClick={()=>props.setIsLogin(true)}>
                Log In 
            </Link>
            <Link to="/signup" className='nav-button-signup' onClick={()=>props.setIsLogin(false)}>
                Sign Up
            </Link>
        </div>
  )      

  let loggedNav = (
    <div className='logged-nav'>
      <Link to="/my-profile" className='user-profile-btn'>
        <UserOutlined style={{fontSize:"20px"}} />
      </Link>
      <div onClick={logoutHandler} className='logout-btn'>Logout</div>
    </div>
  )

  return (
    <div className='nav-div'>

        <Link to="/" className='logo-div' onClick={()=>props.setPage("home")}>
            Blueit
        </Link>

        <form className='search-form' onSubmit={handleSearchSubmit}>
            <input type="search" placeholder='Search' className='search-input' value={searchText} onChange={handleSearchInput} />
            <button type="submit" className="search-button">
                <img src={searchImg}/>
            </button>
        </form>

        {!props.token ? notLoggedNav : loggedNav}
    </div>
  )
}



export default NavBar