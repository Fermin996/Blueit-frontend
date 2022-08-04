import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './PostCard.css'
import {UpOutlined, DownOutlined, CommentOutlined, SaveOutlined} from '@ant-design/icons'
import { updateVotes } from '../../api/posts'
import { timeCheck } from '../../functions/timeCheck'
import { voteInitializer, arrowHandler } from '../../functions/voteFunctions'
import { toggleItemSaved } from '../../functions/toggleItemSaved'

const PostCard = ({setPage, post, setSelectedUser, setSub, user, setUser}) => {

    const [vote, setVote] = useState({votes:null, voteType:null})
    const [dateDiff, setDateDiff] = useState("")
    const [postIsSaved, setPostIsSaved] = useState(false)

    let savedPostFound
    
    useEffect(()=>{
        
        if(user && user.saved){
            savedPostFound = user.saved.savedPosts.find(p => {
                return p === post._id
            })
        }
        
        if(savedPostFound){
            setPostIsSaved(true)
        }

        setDateDiff(timeCheck(post.date))
        setVote(voteInitializer(post, vote, user))
    },[user])
    
    const postSaveClickedHandler=async()=>{
        let updatedUser = await toggleItemSaved(user.userId, post._id, "post", postIsSaved)
        
        setUser({
            userId:updatedUser.user.id,
            username:updatedUser.user.username,
            saved:updatedUser.user.saved
        })
        

        if(postIsSaved){
            setPostIsSaved(false)
        }else{
            setPostIsSaved(true)
        }

    }

    const arrowClickedHandler=async(voteType)=>{
        let voteData
        voteData = await arrowHandler(user, voteType, post, vote, "post")
        setVote(voteData)
    }

    let arrowUpDiv=(
        <div className='arrow-container' onClick={()=>arrowClickedHandler("upVote")}>
            <UpOutlined />
        </div>
    )

    let arrowDownDiv = (
        <div className='arrow-container' onClick={()=>arrowClickedHandler("downVote")}>
            <DownOutlined/>
        </div>
    )


    if(vote.voteType==="upVote"){
        arrowUpDiv = (
            <div className='arrow-container-selected' onClick={()=>arrowClickedHandler("upVote")}>
                <UpOutlined style={{color: 'orangered'}}/>
            </div> 
        )
    }else if(vote.voteType==="downVote"){
        arrowDownDiv = (
            <div className='arrow-container-selected' onClick={()=>arrowClickedHandler("downVote")}>
                <DownOutlined style={{color:'alice  blue'}}/>
            </div> 
        )
    }

    let saveIcon = (
        <>
            <SaveOutlined/>
            <div className='save-label' onClick={postSaveClickedHandler}>
                Save
            </div>
        </>
     )  
    
    if(postIsSaved){
        saveIcon = (
            <>
                <SaveOutlined style={{color:"blue"}}/>
                <div className='save-label' onClick={postSaveClickedHandler}>
                    Unsave
                </div>
            </>
        )
    }

  return (
    <div className='post-div'>
        <div className='post-votes-div'>
            <div className='posts-votes-sub-div'>
                {arrowUpDiv}
            </div>
            <div className='posts-votes-sub-div-votes'>{vote.votes}</div>
            <div className='posts-votes-sub-div'>
                {arrowDownDiv}
            </div>
        </div>
        <div className='post-content'>
            <div className='post-info'>
                <Link className='post-sub' to='/sub-view' onClick={()=>setSub(post.sub)} >b/{post.subName}</Link>
                <div className='post-card-date-text'>Posted by</div>
                <Link className='post-user' to='/user-profile' onClick={()=>setSelectedUser(post.user)} >u/{post.username}</Link>
                <div className='post-card-date-text'>{dateDiff}</div>
            </div>
            <Link className='post-media' to="/post-view" onClick={()=>setPage(post._id)}>
                <h3 className='post-title'>{post.title}</h3>
                <div className='post-text'>{post.text}</div>
            </Link>
            <div className='post-options'>
                <Link to="/post-view" onClick={()=>setPage(post._id)} className='post-options-btn'>
                    <CommentOutlined />
                    <div className="comment-label">
                        {post.comments.length} Comments
                    </div>
                </Link>
                <div className='post-options-btn'>
                    {saveIcon}
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostCard