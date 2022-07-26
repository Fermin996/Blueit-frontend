import React, { useEffect, useState } from 'react'
import './SubView.css'

import SubBlueCard from '../SubBlueCard/SubBlueCard'
import PostCard from '../PostCard/PostCard'
import { getPostsBySub } from '../../api/posts'

const SubView = ({sub, user, setSelectedUser, setPage}) => {

  const [subPosts, setSubPosts] = useState()  

  const getSubPosts=async()=>{
    let subObj

    try{
        subObj = await getPostsBySub(sub)
        setSubPosts(subObj.page)
    }catch(err){
        console.log(err)
    }
  }  

  useEffect(()=>{
    getSubPosts()
  },[])  

  if(!subPosts){
      return <div>...Loading</div>
  }
  console.log(subPosts)
  return (
    <div className='sub-view-back'>
      <div className='sub-view-posts-div'>
        {subPosts.map((post)=>{
          return <PostCard post={post} sub={sub} user={user} setSelectedUser={setSelectedUser} setPage={setPage}/>
        })}
      </div>  
        <SubBlueCard selectedSub={sub}/>
    </div>
  )
}

export default SubView