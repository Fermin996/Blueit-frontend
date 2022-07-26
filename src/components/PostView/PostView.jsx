import React, {useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import Comment from '../Comment/Comment'
import "./PostView.css"
import SubBlueCard from '../SubBlueCard/SubBlueCard'
import {UpOutlined, DownOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CommentOutlined} from '@ant-design/icons'
import {message, Popconfirm } from 'antd'
import { getPostById, editPost, deletePost } from '../../api/posts'
import { createComment, getCommentsByPost } from '../../api/comments'
import { arrowHandler, voteInitializer } from '../../functions/voteFunctions'


const PostView = ({page, user, selectedUser, setSelectedUser}) => {

    const [commentData, setCommentData] = useState({text:""})
    const [currComments, setCurrComments] = useState(false)
    const [postData, setPostData] = useState({})
    const [postVote, setPostVote] = useState({votes:null, voteType:null})
    const [postEditClicked, setPostEditClicked] = useState(false)
    const [postEditText, setPostEditText] = useState("")
   
    useEffect(()=>{
        const getCurrPost=async(post)=>{
            let postDataCont
            postDataCont = await getPostById(post)
            setPostData(postDataCont)
            setPostVote(voteInitializer(postDataCont.post, postVote, user))
        }
        getCurrPost(page)
    },[])

    useEffect(()=>{
        if(postData.post){
            setPostEditText(postData.post.text)
        }
    },[postEditClicked])

   
    const commentTextHandler=(e)=>{
        setCommentData({...setCommentData, [e.target.name]:e.target.value })
    }   
    
    
    const handleCommentSubmit= async(e)=>{
        e.preventDefault()

        try{
            let data = {...commentData, user:user.userId, username:user.username , post:page}
            await createComment(data)
        }catch(err){
            console.log(err)
        }

    }

    const handlePostEditClicked=()=>{
        setPostEditClicked(true)
        setPostEditText(postData.text)
    }

    const createCommentArr =async(postId)=>{
       let commentArray = await getCommentsByPost(postId)
       setCurrComments(commentArray)
    }

    const arrowClickedHandler=async(voteType)=>{
        let voteData
        voteData = await arrowHandler(user, voteType, {_id:page}, postVote, "post")
        setPostVote(voteData)
    }

    const handlePostEdit=(e)=>{
        let updatedText= {[e.target.name]:e.target.value}
        setPostEditText(updatedText.text)
    }

    const handlePostEditSubmit = async(e)=>{
        e.preventDefault()

        try{
            let editedPost
            editedPost = await editPost(postData.post._id, postEditText)
        }catch(err){
            console.log(err)
        }
    }

    const deleteConfirmed=async(e)=>{
        let deletedPost
        deletedPost = await deletePost(postData.post._id)
    }


    let commentDiv=(
        <div>loading</div>
    )
    
    if(!postData.post){
        return <div></div>
    }  

    if(currComments){

        commentDiv=(
            currComments.map((comment) => {
                return <Comment key={comment._id} thisCommentData={comment} user={user} setSelectedUser={setSelectedUser}/>
            })
        )
    }else{
        createCommentArr(postData.post._id)
    }


    let postUpArrowDiv = (
        <div className='post-div-votes' onClick={()=>arrowClickedHandler("upVote")}>
            <UpOutlined />
        </div>
    )

    let postDownArrowDiv = (
        <div className='post-div-votes' onClick={()=>arrowClickedHandler("downVote")}>
            <DownOutlined />
        </div>
    )

    let postOptionsDiv = (
        <div className='post-view-options'>
            <div>
                Comments
            </div>
            <div>
                Save
            </div>
        </div>
    )
    
    let postEditDiv = (
        <form onSubmit={handlePostEditSubmit}>
            <textarea value={postEditText} onChange={handlePostEdit} rows={6} name="text" />
            <div>
                <button>Done</button>
            </div>
        </form>
    )

    if(postVote.voteType==="upVote"){
        postUpArrowDiv = (
            <div className='post-div-votes-selected' onClick={()=>arrowClickedHandler("upVote")}>
                <UpOutlined style={{color: 'orangered'}}/>
            </div> 
        )
    }else if(postVote.voteType==="downVote"){
        postDownArrowDiv = (
            <div className='post-div-votes-selected' onClick={()=>arrowClickedHandler("downVote")}>
                <DownOutlined style={{color:'blue'}}/>
            </div> 
        )
    }

    if(user.userId === postData.post.user){
        postOptionsDiv = (
        <div className='post-view-options'>
            <div className='post-view-options-btn'>
                <CommentOutlined />
                <div className='comment-label'>
                    Comments
                </div>
            </div>
            <div className='post-view-options-btn'>
                <SaveOutlined />
                Save
            </div>
            <div className='post-view-options-btn' onClick={handlePostEditClicked}>
                <EditOutlined />
                Edit
            </div>
            <Popconfirm
                title="Are you sure you want to delete this post?"
                onConfirm={deleteConfirmed}
                okText={"Yes"}
            >
                <div className='post-view-options-btn' >
                    <DeleteOutlined />
                    Delete
                </div>
            </Popconfirm>
        </div>
        )
    }

  return (
    <div className='post-back'>
        <div className='post-div'>
            <div className='up-down-votes'>
                {postUpArrowDiv}
                <div className='tester-div-votes'>
                    {postVote.votes}
                </div>
                {postDownArrowDiv}
            </div>
            <div className='post-content'>
                <div className='post-info'>
                    <Link className='post-sub' to='/'>b/{postData.post.subName}</Link>
                    <div className='post-user'>u/{postData.post.username}</div>
                </div>
                <div className='post-media'>
                    <h3 className='post-title'>{postData.post.title}</h3>
                    {postEditClicked ? postEditDiv : <div className='post-text'>{postData.post.text}</div>}
                </div>
                {postOptionsDiv}
            </div>
        </div>
        <div className='comments-and-form'>
            <form onSubmit={handleCommentSubmit} className='comment-form'>
                <textarea rows={6} name="text" onChange={commentTextHandler} className="init-comment-TA" />
                <div className='comment-btn-div'>
                    <button type="submit" className='text-done-btn'>Done</button>
                </div>
            </form>
            <div className='comments-div'>
                {commentDiv}
            </div>
        </div>
    </div>
  )
}

export default PostView