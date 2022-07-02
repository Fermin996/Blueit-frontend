import React, {useState, useEffect} from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import PostsPage from './components/PostsPage/PostsPage';
import CreatePost from './components/CreatePost/CreatePost';
import NavBar from './components/NavBar/NavBar'
import Login from './components/Login/Login';
import PostView from './components/PostView/PostView';
import UserProfile from './components/UserProfile/UserProfile';
import { getPosts } from './api/posts';
import { login } from './api/users';
import SubView from './components/SubView/SubView';

function App() {

  const [currPosts, setCurrPosts] = useState({page:[]})
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState("home") 
  const [isLogin, setIsLogin] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [sub, setSub] = useState(null)

  const autoLogin = async(inData)=>{
    let data;
    data=await login(inData)

    if(data){
      setToken(data.token)
      setUser({userId: inData.userId, username: data.userName})
    }

  }
  
  useEffect(()=>{
    let storedData = JSON.parse(localStorage.getItem("user"))
  
    if(storedData && storedData.token){
      autoLogin(storedData)  
    }

  },[])

  return (
    <div className="App">
      <NavBar 
        currPosts={currPosts} setCurrPosts={setCurrPosts} 
        token={token} setToken={setToken} isLogin={isLogin}
        setIsLogin={setIsLogin}
        />
        <div className='nav-buffer'></div>
      <Routes>
        <Route path='/' element={<PostsPage 
          currPosts={currPosts} setCurrPosts={setCurrPosts} page={page} setPage={setPage} 
          setSelectedUser={setSelectedUser} setSub={setSub} user={user} />} />
        <Route path='/create-post' element={<CreatePost token={token} user={user} />} />
        <Route path='/login' element={<Login setToken={setToken} setUser={setUser} isLogin={true}/>} />
        <Route path='/signup' element={<Login setToken={setToken} setUser={setUser} isLogin={false}/>} />
        <Route path='/post-view' element={<PostView page={page} user={user} />} />
        <Route path='/user-profile' element={<UserProfile selectedUser={selectedUser}/>} />
        <Route path='/sub-view' element={<SubView sub={sub} />}/> 
      </Routes>
    </div>
  );
}

export default App;
