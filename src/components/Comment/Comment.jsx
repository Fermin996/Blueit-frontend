import React, {useEffect, useState, useContext} from 'react'
import { createComment, getCommentsByParent, editComment, deleteComment } from '../../api/comments'
import {CaretUpOutlined, CaretDownOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
import './Comment.css'
import { timeCheck } from '../../functions/timeCheck'
import {message, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import {voteInitializer, arrowHandler} from '../../functions/voteFunctions'
import { toggleItemSaved } from '../../functions/toggleItemSaved'
import { UserContext } from '../../helpers/user-context'

const Comment = ({thisCommentData, user, profileView, setSelectedUser}) => {

    const [currComments, setCurrComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [replyClicked, setReplyClicked] = useState(false)
    const [editCommentClicked, setEditCommentClicked] = useState(false)
    const [dateDiff, setDateDiff] = useState("")
    const [commentVote, setCommentVote] = useState({votes:null, voteType:null})
    const [commentSaved, setCommentSaved] = useState(false)

    const usrCtx = useContext(UserContext)

    const getCurrComments = async()=>{
        setCurrComments(await getCommentsByParent(thisCommentData._id))
    }

    useEffect(()=>{
        setDateDiff(timeCheck(thisCommentData.date))

        if(!profileView){
            getCurrComments()
        }
    },[])

    useEffect(()=>{
        setCommentVote(voteInitializer(thisCommentData, commentVote, usrCtx.userId))
    },[])

    let replyDiv=null
    let commentDiv=null

    const commentTextHandler =(e)=>{
        setCommentText({[e.target.name]:e.target.value})
    }

    const handleCommentSubmit=async(e)=>{
        e.preventDefault()
        try{
            let data = {...commentText, user:usrCtx.userId, username: usrCtx.userName, parentComment:thisCommentData._id}
            await createComment(data)
        }catch(err){
            console.log(err)
        }
    }

    const arrowClickedHandler=async(voteType)=>{
        let outData
        outData = await arrowHandler(usrCtx.userId, voteType, thisCommentData, commentVote, "comment")
        setCommentVote(outData)
    }

    const handleEditClicked=()=>{
        setEditCommentClicked(true)
        setCommentText(thisCommentData)
    }
    
    const handleCommentEdit=async(e)=>{
        e.preventDefault()

        try{
            let editedText
            editedText= await editComment(thisCommentData._id ,commentText.text)
        }catch(err){
            console.log(err)
        }
    }

    const deleteCommentConfirmed=async(e)=>{
        let deletedComment
        deletedComment = await deleteComment(thisCommentData._id)
    }

    const commentSaveHandler=()=>{
    
        toggleItemSaved(usrCtx.userId, thisCommentData._id, "comment", commentSaved)
        if(commentSaved){
            setCommentSaved(false)
        }else{
            setCommentSaved(true)
        }

    }

    if(!thisCommentData._id){
        return <div>LOADING</div>
    }

    if(profileView){
        return(
            <div className='comment-div'>
                <div className='comment-user'>{thisCommentData.userName}</div>
                <div className='comment-text'>{thisCommentData.text}</div>
            </div>
        )
    }

    if(replyClicked){
        replyDiv = (
            <form onSubmit={handleCommentSubmit} className='comment-form'>
                <textarea rows={6} name="text" onChange={commentTextHandler} className="init-comment-TA" />
                <div className='comment-btn-div'>
                    <button type="submit" className='text-done-btn'>Done</button>
                </div>
            </form>
        )
    }

    if(currComments && currComments.length !== 0){
        commentDiv =(
            <div className='comments-div'>
                {currComments.map((comment) => {
                    return <Comment thisCommentData={comment} setSelectedUser={setSelectedUser}/>
                })}
            </div>
        )
    }


    let currentUserComment = (
        <>
        <div onClick={handleEditClicked} className="comm-option-btn">
            Edit
        </div>
        <Popconfirm
            title="Are you sure you would like to delete this comment?"
            onConfirm={deleteCommentConfirmed}
        >
            <div className="comm-option-btn">
                Delete
            </div>
        </Popconfirm>
        </>

        
    )


    let commentBox = (
        <>
            <div className='comment-text'>{thisCommentData.text}</div>
            <div className='comment-options'>
                <div className='comment-vote-btn'>
                    <div className={commentVote.voteType==="upVote" ?"comment-vote-selected":'comment-vote-op'} onClick={()=>arrowClickedHandler("upVote")}>
                        <ArrowUpOutlined style={commentVote.voteType==="upVote" ? {color: 'orangered'}:null}/>
                     </div>
                    <div>{commentVote.votes}</div>
                    <div className={commentVote.voteType==="downVote"?'comment-vote-selected':"comment-vote-op"} onClick={()=>arrowClickedHandler("downVote")}>
                        <ArrowDownOutlined style={commentVote.voteType==="downVote" ? {color:'blue'}:null}/>
                    </div> 
                </div>
                <div onClick={()=>setReplyClicked(true)} className="comm-option-btn">Reply</div>
                <div className="comm-option-btn" onClick={commentSaveHandler}>Save</div>
                {usrCtx.userId === thisCommentData.user ? currentUserComment : null}
            </div>
        </>
    )

    if(editCommentClicked){
        commentBox=(
            <form onSubmit={handleCommentEdit} className='comment-form'>
                <textarea rows={6} name="text" value={commentText.text} onChange={commentTextHandler} className="init-comment-TA" />
                <div className='comment-btn-div'>
                    <button type="submit" className='text-done-btn'>Done</button>
                </div>
            </form>
        )
    }

    return (
        <div className='comment-div'>
            <div className='comment-user'>
                <Link to="/user-profile" className='comment-user-text' onClick={()=>setSelectedUser(thisCommentData.user)}>
                    {thisCommentData.userName}
                </Link>
                <p className='comm-date'>
                    {dateDiff}
                </p>
            </div>
            {commentBox}
            {replyDiv}
            {commentDiv}
        </div> 
    )
}

export default Comment