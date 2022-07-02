import React, { useEffect, useState } from 'react'
import './SubView.css'

import SubBlueCard from '../SubBlueCard/SubBlueCard'
import PostCard from '../PostCard/PostCard'
import { getPostsBySub } from '../../api/posts'

const SubView = (props) => {

  const [subPosts, setSubPosts] = useState()  

  const getSubPosts=async()=>{
    let subObj

    try{
        console.log(props.sub)
        subObj = await getPostsBySub(props.sub)
        console.log("sub obj returned")
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
    <div>  
        {subPosts.map((post)=>{
            <PostCard post={post} sub={props.sub}/>
        })}
        {/* <SubBlueCard  /> */}
    </div>
  )
}

export default SubView