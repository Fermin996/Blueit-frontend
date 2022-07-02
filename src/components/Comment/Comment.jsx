import React, {useEffect, useState} from 'react'
import { createComment, getCommentsByParent } from '../../api/comments'
import {CaretUpOutlined, CaretDownOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
import './Comment.css'
// import Comment from '../Comment/Comment'

const Comment = ({thisCommentData, user, profileView}) => {

    const [currComments, setCurrComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [replyClicked, setReplyClicked] = useState(false)

    const getCurrComments = async()=>{
            
        setCurrComments(await getCommentsByParent(thisCommentData._id))
    }

    useEffect(()=>{
        // const getCurrComments = async()=>{
            
        //     setCurrComments(await getCommentsByParent(thisCommentData._id))
        // }
        if(!profileView){
            getCurrComments()
        }
    },[])

    let replyDiv=null
    let commentDiv=null

    console.log("comment rendder")

    const commentTextHandler =(e)=>{

        setCommentText({[e.target.name]:e.target.value})

    }

    const handleCommentSubmit=async(e)=>{
        e.preventDefault()

        try{
            let data = {...commentText, user:user.userId, username: user.username, parentComment:thisCommentData._id}
            await createComment(data)

        }catch(err){
            console.log(err)
        }

    }
    
    if(!thisCommentData._id){
        return(<div>LOADING</div>)
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
            // <form onSubmit={handleCommentSubmit} >
            //     <textarea rows={6} name="text" onChange={commentTextHandler} />
            //     <button type="submit" className='reply-button' >Reply</button>   
            // </form>
            <form onSubmit={handleCommentSubmit} className='comment-form'>
            <textarea rows={6} name="text" onChange={commentTextHandler} className="init-comment-TA" />
            <div className='comment-btn-div'>
                <button type="submit" className='text-done-btn'>Done</button>
            </div>
        </form>
        )
    }

    if(currComments && currComments.length !== 0){
        console.log(currComments)
        commentDiv =(
            <div className='comments-div'>
                {currComments.map((comment) => {
                    return <Comment thisCommentData={comment} user={user}/>
                })}
            </div>
        )
    }

    return (
        <div className='comment-div'>
            <div className='comment-user'>{thisCommentData.userName}</div>
            <div className='comment-text'>{thisCommentData.text}</div>
            <div className='comment-options'>
                <div className='comment-vote-btn'>
                    <div className='comment-vote-op'><ArrowUpOutlined/></div>
                    <div>0</div>
                    <div className='comment-vote-op'><ArrowDownOutlined/></div>
                </div>
                <div onClick={()=>setReplyClicked(true)}>Reply</div>
                <div>Save</div>
            </div>
            {replyDiv}
            {commentDiv}
        </div>
    )
}

export default Comment