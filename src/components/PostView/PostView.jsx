import React, {useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import Comment from '../Comment/Comment'
import "./PostView.css"
import SubBlueCard from '../SubBlueCard/SubBlueCard'
import {UpOutlined, DownOutlined} from '@ant-design/icons'
import { getPostById } from '../../api/posts'
import { createComment, getCommentsByPost } from '../../api/comments'


const PostView = (props) => {

    const [commentData, setCommentData] = useState({text:""})
    const [currComments, setCurrComments] = useState(false)
    const [postData, setPostData] = useState({})
    // const [replyClicked, setReplyClicked] = useState(false);
    // const [parent, setParent] = useState()

    console.log("render")

    useEffect(()=>{
        const getCurrPost=async(post)=>{
            setPostData(await getPostById(post))
        }

        getCurrPost(props.page)

    },[])
   
    const commentTextHandler=(e)=>{
        setCommentData({...setCommentData, [e.target.name]:e.target.value })
    }   
    
    
    const handleCommentSubmit= async(e)=>{
        e.preventDefault()

        console.log(props.user)
        try{
            let data = {...commentData, user:props.user.userId, username:props.user.username , post:props.page}
            console.log(data)
            await createComment(data)
        }catch(err){
            console.log(err)
        }

    }

    const createCommentArr =async(postId)=>{
       let commentArray = await getCommentsByPost(postId)
       setCurrComments(commentArray)
    }

    let commentDiv=(
        <div>loading</div>
    )

    
    // function replyClickHandler(id){
    //     setReplyClicked(
    //         {   
    //             commentId:id,
    //             commentStyle:(
    //             <form onSubmit={handleCommentSubmit} ref={commentParentRef} parentcommentid={id}>
    //                 <textarea rows={6} name="text" onChange={commentTextHandler} />
    //                 <button type="submit" className='reply-button' parentcommentid={id}>Reply</button>   
    //             </form>)
    //          }
    //         )

    // }    
    
    if(!postData.post){
        return <div></div>
    }  

    if(currComments){

        commentDiv=(
            currComments.map((comment) => {
                // return <div className='comment-div'>
                //     <div className='comment-user'>{comment.user}</div>
                //     <div className='comment-text'>{comment.text}</div>
                //     <div className='comment-options'>
                //         <div>Votes</div>
                //         <div onClick={()=>replyClickHandler(comment._id)}>Reply</div>
                //         <div>Save</div>
                //     </div>
                //     { comment._id === replyClicked.commentId ? replyClicked.commentStyle : null}
                // </div>
                return <Comment thisCommentData={comment} user={props.user}/>
            })
        )
    }else{
        createCommentArr(postData.post._id)
    }


  return (
    <div className='post-back'>
        <div className='post-div'>
            <div className='up-down-votes'>
                <div className='tester-div-votes'>
                    <UpOutlined />
                </div>
                <div className='tester-div-votes'>
                    5
                </div>
                <div className='tester-div-votes'>
                    <DownOutlined />
                </div>
            </div>
            <div className='post-content'>
                <div className='post-info'>
                    <Link className='post-sub' to='/'>b/{postData.post.subName}</Link>
                    <div className='post-user'>u/{postData.post.username}</div>
                </div>
                <div className='post-media'>
                    <h3 className='post-title'>{postData.post.title}</h3>
                    <div className='post-text'>{postData.post.text}</div>
                </div>
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