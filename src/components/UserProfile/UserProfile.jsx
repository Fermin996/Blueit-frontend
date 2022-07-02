import React, {useEffect, useState} from 'react'

import './UserProfile.css'
import { getCommentsByUser } from '../../api/comments'
import { getPostsByUser } from '../../api/posts'
import PostCard from '../PostCard/PostCard'
import Comment from '../Comment/Comment'


const UserProfile = (props) => {

  const [items, setItems] = useState(null)
  const [selected, setSelected] = useState('posts')

  const getUserPosts = async(userId)=>{
    let data
    data = await getPostsByUser(userId)
    setItems([...data.currUser.posts])
  }  
  console.log(items)
  console.log(selected)
  const getUserComments = async(userId)=>{
    let data
    data = await getCommentsByUser(userId)
    setItems([...data.comments])
  }

  useEffect(()=>{

    if(selected === 'posts'){
        getUserPosts(props.selectedUser)
    }else if(selected === 'comments'){
        console.log("this ran")
        getUserComments(props.selectedUser)
    }

  },[selected])  


  let ovSelectStyle = null;
  let postSelectStyle = null;
  let commentSelectStyle = null;

  let selectedViewDiv = <div></div>

  

  if(selected === 'overview'){
    ovSelectStyle="ov-selected"
  }else if(selected === 'posts'){
    postSelectStyle="post-selected"
  }else if(selected === 'comments'){
    commentSelectStyle="comments-selected"
}

    if(items === null){
        return <div>...loading</div>
    }  
    if(selected === 'posts'){
      selectedViewDiv = items.map((item) => {                
        return <PostCard selectedUser={props.selectedUser} post={item}/>
      })
    }else if(selected === 'comments'){
      selectedViewDiv = items.map((item) => {             
        console.log(item)   
        return <Comment thisCommentData={item} post={item} profileView={true}/>
      })
    }


  return (
    <div>
        <ul className='user-prof-ul'>
            <li className={ovSelectStyle} onClick={()=>setSelected('overview')}>Overview</li>
            <li className={postSelectStyle} onClick={()=>setSelected('posts')}>Posts</li>
            <li className={commentSelectStyle} onClick={()=>setSelected('comments')}>Comments</li>
        </ul>
        <div className='user-prof-page'>
          {selectedViewDiv}
        </div>
    </div>
  )
}

export default UserProfile