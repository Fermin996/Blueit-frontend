import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './PostCard.css'
import {UpOutlined, DownOutlined, CommentOutlined, SaveOutlined} from '@ant-design/icons'
import { updateVotes } from '../../api/posts'

const PostCard = ({setPage, post, setSelectedUser, setSub, user}) => {

    const [vote, setVote] = useState({votes:null, voteType:null})
    
    useEffect(()=>{
        let newDate = new Date()
        let postDate = new Date(post.date)
        let diff = Math.abs(newDate - postDate)
        console.log(diff/=(1000*60*60))
        // Checking if user has liked loaded post
        //then sets vote state for each vote
        if(post.voteUsers && !vote.votes && user){
            // for(let x=0; x<post.voteUsers.length; x++){
            //     if(user.userId === post.voteUsers[x].userVote.user && post.voteUsers[x].userVote.voteType === "downVote"){          
            //         setVote({voteType:"downVote", votes:post.votes, voteId:post.voteUsers[x]._id})
            //         break
            //     }else if(user.userId === post.voteUsers[x].userVote.user && post.voteUsers[x].userVote.voteType === "upVote"){
            //         setVote({voteType:"upVote", votes:post.votes, voteId:post.voteUsers[x]._id})
            //         break
            //     }
            //     if(!vote.votes && x === post.voteUsers.length-1){
            //         setVote({voteType:null, votes:post.votes, voteId:null})
            //     }
            // }

            let foundVote;

            foundVote = post.voteUsers.find((vote) => {
                return vote.userVote.user === user.userId
            })

            console.log(foundVote)

            if(foundVote && foundVote.userVote.voteType === "downVote"){          
                setVote({voteType:"downVote", votes:post.votes, voteId:foundVote._id})    
            }else if(foundVote && foundVote.userVote.voteType === "upVote"){
                setVote({voteType:"upVote", votes:post.votes, voteId:foundVote._id})
            }

            if(!vote.votes && !foundVote){
                setVote({voteType:null, votes:post.votes, voteId:null})
            }

            // if there are no vote users, only set vote count
            if(post.voteUsers.length === 0){
                setVote({voteType:null, votes:post.votes, voteId:null})
            }
        }else{
            // if user id not logged in, only set vote count
            setVote({voteType:null, votes:post.votes, voteId:null})    
     }
    },[])

    let arrowUpDiv=(
        <div className='arrow-container' onClick={()=>arrowHandler("upVote")}>
            <UpOutlined />
        </div>
    )

    let arrowDownDiv = (
        <div className='arrow-container' onClick={()=>arrowHandler("downVote")}>
            <DownOutlined/>
        </div>
    )

    
    const arrowHandler=async(voteType)=>{
        let newVoteType

        if(!user){
            return
        }


        // try {
            let tempVoteCount
            let newPost;
            tempVoteCount = vote.votes
            if(!vote.voteType && voteType === "upVote"){
                newVoteType="upVote"
                tempVoteCount+=1
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                console.log(newPost)
                // let foundVoteId = newPost.post.voteUsers.find(voteU => voteU.userVote.user === user)
                let foundVoteId = newPost.post.voteUsers.find((voteUser) => {
                    return voteUser.userVote.user === user.userId
                })
                console.log(foundVoteId)
                setVote({votes:tempVoteCount, voteType:"upVote", voteId:foundVoteId._id})
            }else if(!vote.voteType && voteType === "downVote"){
                newVoteType="downVote"
                tempVoteCount--
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                let foundVoteId = newPost.post.voteUsers.find((voteUser) => {
                    return voteUser.userVote.user === user.userId
                })
                setVote({votes:tempVoteCount, voteType:"downVote", voteId:foundVoteId._id})
            }else if(vote.voteType === "upVote" && voteType === "upVote"){
                newVoteType = "upUnclicked"
                tempVoteCount--
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                setVote({votes:tempVoteCount, voteType:null, voteId:null})
            }else if(vote.voteType === "downVote" && voteType === "downVote"){
                newVoteType = "downUnclicked"
                tempVoteCount++
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                setVote({votes:tempVoteCount, voteType:null, voteId:null})
            }else if(vote.voteType === "upVote" && voteType === "downVote"){
                newVoteType = "utoD"
                tempVoteCount-=2
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                setVote({votes:tempVoteCount, voteType:"downVote", voteId:vote.voteId})
            }else if(vote.voteType === "downVote" && voteType === "upVote"){
                newVoteType = "dtoU"
                tempVoteCount+=2
                newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)
                setVote({votes:tempVoteCount, voteType:"upVote", voteId:vote.voteId})
            }

            // newPost = await updateVotes(user, newVoteType, post._id, vote.voteId)

            console.log(newPost)

        // } catch (error) {
        //     console.log(error)
        // }

    }

    if(vote.voteType==="upVote"){
        arrowUpDiv = (
            <div className='arrow-container-selected' onClick={()=>arrowHandler("upVote")}>
                <UpOutlined style={{color: 'orangered'}}/>
            </div> 
        )
    }else if(vote.voteType==="downVote"){
        arrowDownDiv = (
            <div className='arrow-container-selected' onClick={()=>arrowHandler("downVote")}>
                <DownOutlined style={{color:'navy'}}/>
            </div> 
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
                <Link className='post-sub' to='/sub-view' onClick={()=>setSub(post.subName)} >b/{post.subName}</Link>
                <Link className='post-user' to='/user-profile' onClick={()=>setSelectedUser(post.user)} >u/{post.username}</Link>
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
                    <SaveOutlined />
                    <div className='save-label'>
                        Save
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostCard