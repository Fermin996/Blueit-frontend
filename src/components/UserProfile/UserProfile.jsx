import React, {useEffect, useState} from 'react'

import './UserProfile.css'
import { getCommentsByUser, getCommentById } from '../../api/comments'
import { getPostsByUser, getPostById } from '../../api/posts'
import PostCard from '../PostCard/PostCard'
import Comment from '../Comment/Comment'
import { getSavedItems, getUser, editUserBio } from '../../api/users'


const UserProfile = (props) => {
  const [items, setItems] = useState(null)
  const [selected, setSelected] = useState('posts')
  const [selectedUserData, setSelectedUserData] = useState({})
  const [editBioClicked, setEditBioClicked] = useState(false)
  const [editBioText, setEditBioText] = useState("")

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
    console.log(userId)
    data = await getPostsByUser(userId)
    setItems([...data.currUser.posts])
  }  
  console.log(props)
  const getUserComments = async(userId)=>{
    let data
    data = await getCommentsByUser(userId)
    setItems([...data.comments])
  }

  const getItems=async(userId)=>{
    let data
    let itemArr = []
    data = await getSavedItems(userId)


    for(let x=0; x < data.saved.savedPosts.length; x++){
      let currItem
      currItem = await getPostById(data.saved.savedPosts[x])
      itemArr.push(currItem)
    }

    
    let startIndex = 0
    for(let y=0; y < data.saved.savedComments.length; y++){
      let commentItem

      commentItem = await getCommentById(data.saved.savedComments[y])
      
      for(let z=startIndex; z<=itemArr.length; z++){

        let itemDate;
        let commentDate = new Date(commentItem.comment.date)

        if(!itemArr[z].post){
          itemDate = new Date(itemArr[z].comment.date)
        }else{
          itemDate = new Date(itemArr[z].post.date)
        }
        
        if(commentDate < itemDate ){
          itemArr.splice(z, 0, commentItem)
          startIndex=z+1
          break
        }

        if( itemArr.length < z+2){
          itemArr.push(commentItem)
          
          startIndex=z+1
          break
        }
        
        let itemDate2 = new Date(itemArr[z+1].post.date)
        if(itemDate < commentDate && commentDate < itemDate2){
          itemArr.splice(z+1, 0, commentItem)
          startIndex = z+1
          break
        }
        
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


  let ovSelectStyle = null;
  let postSelectStyle = null;
  let commentSelectStyle = null;
  let selectedViewDiv = <div></div>

  let userSaved = (
    <li className={ovSelectStyle} onClick={()=>setSelected('saved')}>Saved</li>
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
    await editUserBio(editBioText, props.user.userId)
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

  if(selected === 'posts'){
    postSelectStyle="post-selected"
  }else if(selected === 'comments'){
    commentSelectStyle="comments-selected"
  }

    if(items === null){
        return <div>...loading</div>
    }

    if(selected === 'posts'){
      selectedViewDiv = items.map((item) => {        
        return <PostCard selectedUser={props.selectedUser} post={item} setPage={props.setPage} user={props.user}/>
      })
    }else if(selected === 'comments'){
      selectedViewDiv = items.map((item) => {     
        return <Comment thisCommentData={item} post={item} profileView={true}/>
      })
    }else if(selected === 'saved'){
      selectedViewDiv =items.map((item)=>{
        if(item.post){
          return <PostCard selectedUser={props.selectedUser} post={item.post} setPage={props.setPage} user={props.user}/>
        }else if(item.comment){
          return <Comment thisCommentData={item.comment} post={item.comment} profileView={true}/>
        }
      })
    }

    if(items.length === 0){
      selectedViewDiv = noItems
    } 

   
  return (
    <div className='user-prof-div'>
      <div className='user-op-side'>
          <ul className='user-prof-ul'>
              <li className={postSelectStyle} onClick={()=>setSelected('posts')}>Posts</li>
              <li className={commentSelectStyle} onClick={()=>setSelected('comments')}>Comments</li>
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