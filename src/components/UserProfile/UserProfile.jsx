import React, {useEffect, useState, useContext} from 'react'

import './UserProfile.css'
import { getCommentsByUser, getCommentById } from '../../api/comments'
import { getPostsByUser, getPostById } from '../../api/posts'
import PostCard from '../PostCard/PostCard'
import Comment from '../Comment/Comment'
import { getSavedItems, getUser, editUserBio } from '../../api/users'
import { UserContext } from '../../helpers/user-context'


const UserProfile = (props) => {
  const [items, setItems] = useState(null)
  const [selected, setSelected] = useState('posts')
  const [selectedUserData, setSelectedUserData] = useState({})
  const [editBioClicked, setEditBioClicked] = useState(false)
  const [editBioText, setEditBioText] = useState("")

  const usrCtx = useContext(UserContext)

  const callGetUser=async()=>{
    let usrData

    try{
      usrData = await getUser(props.selectedUser)
    }catch(err){
      console.log(err)
    }

    setSelectedUserData(usrData.user)
    setEditBioText(usrData.user.bio)

  }

  const getUserPosts = async(userId)=>{
    let data
    let sorted =[]
    data = await getPostsByUser(userId)
    
    data.currUser.posts.forEach((post)=>{
      sorted.unshift(post)
    })
    
    setItems([...sorted])
  }  
  
  const getUserComments = async(userId)=>{
    let data
    let sorted =[]
    data = await getCommentsByUser(userId)
    data.comments.forEach((comment)=>{
      sorted.unshift(comment)
    })
    setItems([...sorted])
  }

  const getItems=async(userId)=>{
    let data
    let itemArr = []
    data = await getSavedItems(userId)

    //First adding sorted posts to itemArr
    for(let x=0; x < data.savedPosts.length; x++){
      let currItem
      currItem = await getPostById(data.savedPosts[x].post)
      itemArr.push({post:currItem.post, date:data.savedPosts[x].savedDate})
    }

    
    let startIndex = 0
    
    for(let y=0; y < data.savedComments.length; y++){
      let commentItem

      commentItem = await getCommentById(data.savedComments[y].comment)
      
      for(let z=startIndex; z<=itemArr.length; z++){

        let itemDate;
        let commentDate = new Date(data.savedComments[y].savedDate)

        if(!itemArr[z].sub){
          itemDate = new Date(itemArr[z].date)
        }else{
          itemDate = new Date(itemArr[z].date)
        }
        
        if(commentDate < itemDate ){
          itemArr.splice(z, 0, commentItem)
          startIndex=z+1
          break
        }

        if( itemArr.length < z+2){
          itemArr.push(commentItem.comment)
          
          startIndex=z+1
          break
        }
        
        let itemDate2 = new Date(itemArr[z+1].date)
        if(itemDate < commentDate && commentDate < itemDate2){
          itemArr.splice(z+1, 0, commentItem)
          startIndex = z+1
          break
        }
        
      }

    }

    for(let i=0; i<itemArr.length; i++){
      if(itemArr[i].post){
        itemArr[i] = itemArr[i].post
      }else if(itemArr[i].comment){
        itemArr[i] = itemArr[i].comment
      }
    }

    setItems([...itemArr])

  }

  useEffect(()=>{
    callGetUser()
  },[props.selectedUser])

  useEffect(()=>{
    if(selected === 'posts'){
      getUserPosts(props.selectedUser)
    }else if(selected === 'comments'){
      getUserComments(props.selectedUser)
    }else if(selected === 'saved'){
      getItems(props.selectedUser)
    }

  },[selected])  


  let selectedViewDiv = <div></div>

  let userSaved = (
    <li className={selected==="saved" ? "save-selected":null} onClick={()=>setSelected('saved')}>Saved</li>
  )

  let noItems = (
    <div>
      <p>
        There are no saved {selected} for this user
      </p>
    </div>
  )

  let bioDiv =(
    <p>
      {selectedUserData.bio}
    </p>
  )

  const bioEditSubmitted=async(e)=>{
    e.preventDefault()
    await editUserBio(editBioText, usrCtx.userId)
    setEditBioClicked(false)
    selectedUserData.bio = editBioText
    setSelectedUserData(selectedUserData)
  }

  const handleBioChange=(e)=>{
    setEditBioText(e.target.value)
  }

  const handleCancelBioEdit=()=>{
    setEditBioClicked(false)
    setEditBioText(selectedUserData.bio)
  }

  const postsClickedHandler=()=>{
    setSelected("posts")
    setItems(null)
  }

  if(editBioClicked){

    bioDiv=
    (<form className='bio-edit-div' onSubmit={bioEditSubmitted}>
      <textarea rows={4} value={editBioText} name="text" onChange={handleBioChange} className="bio-edit-textarea"/>
      <div className='bio-edit-btns-div'>
        <button className='bio-edit-sub-button'>Submit</button>
        <button onClick={handleCancelBioEdit} className='bio-edit-sub-button'>Cancel</button>
      </div>
    </form>)
  }

  if(items === null){
      return <div>...loading</div>
  }

  selectedViewDiv=items.map((item)=>{
    if(item.sub){
      return <PostCard selectedUser={props.selectedUser} post={item} setPage={props.setPage}/>
    }else{
      return <Comment thisCommentData={item} post={item} profileView={true}/>
    }
  })

    if(items.length === 0){
      selectedViewDiv = noItems
    } 

  return (
    <div className='user-prof-div'>
      <div className='user-op-side'>
          <ul className='user-prof-ul'>
              <li className={selected==="posts"?"post-selected":null} onClick={()=>postsClickedHandler()}>Posts</li>
              <li className={selected==="comments"?"comments-selected":null} onClick={()=>setSelected('comments')}>Comments</li>
              { props.isUserProf ? userSaved : null }
          </ul>
          <div className='user-prof-page'>
            {selectedViewDiv}
          </div>
      </div>
      <div className='user-card'>
          <div className='user-card-username'>
            <p className='u-card-name-text'>
              {selectedUserData.username}
            </p>            
          </div>
          <div className='u-card-cake-div'>
            Cake Day: {selectedUserData.cakeDay.slice(5,7)+"/"+selectedUserData.cakeDay.slice(8,10)+"/"+selectedUserData.cakeDay.slice(0,4)}
          </div>
          <div className='user-bio-div'>
            <p className='user-bio-label'>Bio</p>
            {bioDiv}
          </div>
          {props.isUserProf && !editBioClicked ? <button onClick={()=>setEditBioClicked(true)}>Edit Bio</button> : null}
          <div className='user-card-karma'>
            <p>
              Karma: {selectedUserData.karma}
            </p>
          </div>
      </div>
    </div>
  )
}

export default UserProfile