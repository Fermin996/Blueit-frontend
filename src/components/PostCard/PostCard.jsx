import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './PostCard.css'
import {UpOutlined, DownOutlined, CommentOutlined, SaveOutlined} from '@ant-design/icons'
import { timeCheck } from '../../functions/timeCheck'
import { voteInitializer, arrowHandler } from '../../functions/voteFunctions'
import { toggleItemSaved } from '../../functions/toggleItemSaved'
import { UserContext } from '../../helpers/user-context'

const PostCard = ({setPage, post, setSelectedUser, setSub}) => {

    const [vote, setVote] = useState({votes:null, voteType:null})
    const [dateDiff, setDateDiff] = useState("")
    const [postIsSaved, setPostIsSaved] = useState(false)

    let savedPostFound

    const usrCtx=useContext(UserContext)
    
    useEffect(()=>{
        if(usrCtx.isLogged && usrCtx.saved){
            savedPostFound = usrCtx.saved.savedPosts.find(p => {
                return p.post === post._id
            })
        }
        
        setPostIsSaved(!!savedPostFound)
        setDateDiff(timeCheck(post.date))
        setVote(voteInitializer(post, vote, usrCtx.userId))
    },[usrCtx.isLogged])
    
    const postSaveClickedHandler=async()=>{
        let updatedUser = await toggleItemSaved(usrCtx.userId, post._id, "post", postIsSaved)

        usrCtx.setUser({
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
        voteData = await arrowHandler(usrCtx.userId, voteType, post, vote, "post")
        setVote(voteData)
    }

  return (
    <div className='post-div'>
        <div className='post-votes-div'>
            <div className='posts-votes-sub-div'>
                <div className={vote.voteType==="upVote" ?'arrow-container-selected' : 'arrow-container'} 
                    onClick={()=>arrowClickedHandler("upVote")}>
                    <UpOutlined style={vote.voteType === "upVote" ? {color:"orangered"} : null}/>
                </div> 
            </div>
            <div className='posts-votes-sub-div-votes'>
                {vote.votes}
            </div>
            <div className='posts-votes-sub-div'>
                <div className={vote.voteType==="downVote" ?'arrow-container-selected' : 'arrow-container'} 
                    onClick={()=>arrowClickedHandler("downVote")}>
                    <DownOutlined style={vote.voteType==="downVote" ? {color:'blue'}: null}/>
                </div> 
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
                <div className='post-options-btn' onClick={postSaveClickedHandler}>
                    <SaveOutlined style={postIsSaved ? {color:"blue"} : null} />
                    <div className='save-label'>
                        {postIsSaved ? "Unsave" : "Save"}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostCard