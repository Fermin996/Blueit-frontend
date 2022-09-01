import React, {useState, useEffect, useContext} from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import PostsPage from './components/PostsPage/PostsPage';
import CreatePost from './components/CreatePost/CreatePost';
import NavBar from './components/NavBar/NavBar'
import Login from './components/Login/Login';
import PostView from './components/PostView/PostView';
import UserProfile from './components/UserProfile/UserProfile';
import SearchResults from './components/SearchResults/SearchResults';
import { login, getSavedItems } from './api/users';
import SubView from './components/SubView/SubView';
import { UserContext } from './helpers/user-context';

function App() {

  const [currPosts, setCurrPosts] = useState({page:[]})
  const [token, setToken] = useState(null)
  const [user, setUser] = useState({userId:null})
  const [page, setPage] = useState("home") 
  const [isLogin, setIsLogin] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [sub, setSub] = useState(null)


  const autoLogin = async(inData)=>{
    let data;
    let savedItems
    data=await login(inData)
    savedItems=await getSavedItems(inData.userId)
    
    if(data){
      setToken(data.token)
      setUser({userId: inData.userId, username: data.userName, saved: savedItems})
    }

  }
  
  useEffect(()=>{
    let storedData = JSON.parse(localStorage.getItem("user"))
  
    if(storedData && storedData.token){
      autoLogin(storedData)  
    }

  },[])
  return (
    <UserContext.Provider 
    value={{
      isLogged:!!token,
      token:token,
      userId:user.userId,
      userName:user.username,
      saved:user.saved,
      setUser: setUser
    }}
    >
      <div className="App">
      <NavBar 
        currPosts={currPosts} setCurrPosts={setCurrPosts} 
        token={token} setToken={setToken} isLogin={isLogin}
        setIsLogin={setIsLogin} user={user} setPage={setPage}
        />
        <div className='nav-buffer'></div>
      <Routes>
        <Route path='/' element={<PostsPage 
          currPosts={currPosts} setCurrPosts={setCurrPosts} page={page} setPage={setPage} 
          setSelectedUser={setSelectedUser} setSub={setSub} user={user} 
           setUser={setUser}
          />} />
        <Route path='/create-post' element={<CreatePost  setPage={setPage} />} />
        <Route path='/login' element={<Login setToken={setToken} setUser={setUser} isLogin={true}/>} />
        <Route path='/signup' element={<Login setToken={setToken} setUser={setUser} isLogin={false}/>} />
        <Route path='/post-view' element={<PostView setSub={setSub} page={page}  selectedUser={selectedUser} setSelectedUser={setSelectedUser} />} />
        <Route path='/user-profile' element={<UserProfile selectedUser={selectedUser} setSelectedUser={setSelectedUser} setPage={setPage}/>} />
        <Route path='/my-profile' element={<UserProfile selectedUser={user.userId}  setPage={setPage} isUserProf={true}/>} />
        <Route path='/sub-view' element={<SubView sub={sub} setSelectedUser={setSelectedUser} setPage={setPage} />}/> 
        <Route path='/search-results' element={<SearchResults setSub={setSub} setSelectedUser={setSelectedUser} setPage={setPage} currPosts={currPosts} />} />
      </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
