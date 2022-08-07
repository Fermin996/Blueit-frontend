import React, {useEffect, useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import Comment from '../Comment/Comment'
import "./PostView.css"
import SubBlueCard from '../SubBlueCard/SubBlueCard'
import {UpOutlined, DownOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CommentOutlined} from '@ant-design/icons'
import {message, Popconfirm } from 'antd'
import { getPostById, editPost, deletePost } from '../../api/posts'
import { createComment, getCommentsByPost } from '../../api/comments'
import { arrowHandler, voteInitializer } from '../../functions/voteFunctions'
import { UserContext } from '../../helpers/user-context'


const PostView = ({page, setSub, user, selectedUser, setSelectedUser}) => {

    const [commentData, setCommentData] = useState({text:""})
    const [currComments, setCurrComments] = useState(false)
    const [postData, setPostData] = useState({})
    const [postVote, setPostVote] = useState({votes:null, voteType:null})
    const [postEditClicked, setPostEditClicked] = useState(false)
    const [postEditText, setPostEditText] = useState("")

    const usrCtx = useContext(UserContext)
   
    useEffect(()=>{
        const getCurrPost=async(post)=>{
            let postDataCont
            postDataCont = await getPostById(post)
            setPostData(postDataCont)
            setPostVote(voteInitializer(postDataCont.post, postVote, usrCtx.userId))
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
        let newComment
        try{
            let data = {...commentData, user:usrCtx.userId, username:usrCtx.userName , post:page}
            newComment = await createComment(data)
            createCommentArr(postData.post._id)
            setCommentData({text:""})
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
        voteData = await arrowHandler(usrCtx.userId, voteType, {_id:page}, postVote, "post")
        setPostVote(voteData)
    }

    const handlePostEdit=(e)=>{
        let updatedText= {[e.target.name]:e.target.value}
        setPostEditText(updatedText.text)
    }

    const handlePostEditSubmit = async(e)=>{
        e.preventDefault()

        let editedPost
        try{
            editedPost = await editPost(postData.post._id, postEditText)
        }catch(err){
            console.log(err)
        }

        setPostData(editedPost)
        setPostEditClicked(false)
    }

    const deleteConfirmed=async(e)=>{
        await deletePost(postData.post._id)
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
                return <Comment key={comment._id} thisCommentData={comment} setSelectedUser={setSelectedUser}/>
            })
        )
    }else{
        createCommentArr(postData.post._id)
    }

    
    let postEditDiv = (
        <form onSubmit={handlePostEditSubmit} className="post-edit-div">
            <textarea className="post-text-edit" value={postEditText} onChange={handlePostEdit} rows={6} name="text" />
            <div className='edit-button-div'>
                <button>Done</button>
            </div>
        </form>
    )


    let userOptionsDiv =(
        <>
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
        </>
    )

  return (
    <div className='post-back'>
        <div className='post-div'>
            <div className='up-down-votes'>
                <div className={postVote.voteType==="upVote"?'post-div-votes-selected':"post-div-votes"} onClick={()=>arrowClickedHandler("upVote")}>
                    <UpOutlined style={postVote.voteType==="upVote" ? {color: 'orangered'}:null}/>
                </div> 
                <div className='tester-div-votes'>
                    {postVote.votes}
                </div>
                <div className={postVote.voteType==="downVote" ? 'post-div-votes-selected' : "post-div-votes"} onClick={()=>arrowClickedHandler("downVote")}>
                    <DownOutlined style={postVote.voteType==="downVote" ? {color:'blue'} : null}/>
                </div> 
            </div>
            <div className='post-content'>
                <div className='post-info'>
                    <Link className='post-sub' to='/sub-view' onClick={()=>setSub(postData.post.sub)}>b/{postData.post.subName}</Link>
                    <Link className='post-user' to="/user-profile" onClick={()=>setSelectedUser(postData.post.user)}>u/{postData.post.username}</Link>
                </div>
                <div className='post-media'>
                    <h3 className='post-title'>{postData.post.title}</h3>
                    {postEditClicked ? postEditDiv : <div className='post-text'>{postData.post.text}</div>}
                </div>
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
                    {usrCtx.userId === postData.post.user ? userOptionsDiv : null}
                </div>
            </div>
        </div>
        <div className='comments-and-form'>
            <form onSubmit={handleCommentSubmit} className='comment-form'>
                <textarea rows={6} value={commentData.text} name="text" onChange={commentTextHandler} className="init-comment-TA" />
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