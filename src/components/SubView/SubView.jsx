import React, { useEffect, useState } from 'react'
import './SubView.css'

import SubBlueCard from '../SubBlueCard/SubBlueCard'
import PostCard from '../PostCard/PostCard'
import { getPostsBySub } from '../../api/posts'

const SubView = ({sub, setSelectedUser, setPage}) => {

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
  
  return (
    <div className='sub-view-back'>
      <h3 className="sub-view-name">{subPosts[0].subName}</h3>
      <div className='sub-view-posts-div'>
        {subPosts.map((post)=>{
          return <PostCard post={post} sub={sub} setSelectedUser={setSelectedUser} setPage={setPage}/>
        })}
      </div>  
        <SubBlueCard selectedSub={sub}/>
    </div>
  )
}

export default SubView