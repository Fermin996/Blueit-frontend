import { updateVotes } from "../api/posts";
import { changeCommentVotes } from "../api/comments";

const voteInitializer=(item, vote, user)=>{
    let voteOb

    if(item.voteUsers && !vote.votes && user){

        let foundVote;
        foundVote = item.voteUsers.find((vote) => {
            return vote.userVote.user === user.userId
        })

        if(foundVote && foundVote.userVote.voteType === "downVote"){          
            voteOb = {voteType:"downVote", votes:item.votes, voteId:foundVote._id}
            return voteOb
        }else if(foundVote && foundVote.userVote.voteType === "upVote"){
            voteOb = {voteType:"upVote", votes:item.votes, voteId:foundVote._id}
            return voteOb
        }

        if(!vote.votes && !foundVote){
            voteOb = {voteType:null, votes:item.votes, voteId:null}
            return voteOb
        }

        // if there are no vote users, only set vote count
        if(item.voteUsers.length === 0){
            voteOb = {voteType:null, votes:item.votes, voteId:null}
            return voteOb
        }
    }else{
        // if user id not logged in, only set vote count
        voteOb = {voteType:null, votes:item.votes, voteId:null}
        return voteOb
    }

}

    

const arrowHandler=async(userId, voteType, item, vote, component)=>{
    let newVoteType
    let voteObj
    const componentCheck=async(component)=>{
        if(component === "comment"){
            return await changeCommentVotes(userId, newVoteType, item._id, vote.voteId)
        }else if(component === "post"){
            return await updateVotes(userId, newVoteType, item._id, vote.voteId)
        }
    }

    if(!userId){
        return
    }

        let tempVoteCount
        let newItem;
        tempVoteCount = vote.votes
        if(!vote.voteType && voteType === "upVote"){
            newVoteType="upVote"
            tempVoteCount+=1
            newItem = await componentCheck(component)
            console.log(newItem)
            let foundVoteId = newItem.item.voteUsers.find((voteUser) => {
                return voteUser.userVote.user === userId
            })
            voteObj = {votes:tempVoteCount, voteType:"upVote", voteId:foundVoteId._id}
            return voteObj
        }else if(!vote.voteType && voteType === "downVote"){
            newVoteType="downVote"
            tempVoteCount--
            newItem = await componentCheck(component)
            let foundVoteId = newItem.item.voteUsers.find((voteUser) => {
                return voteUser.userVote.user === userId
            })
            voteObj = {votes:tempVoteCount, voteType:"downVote", voteId:foundVoteId._id}
            return voteObj
        }else if(vote.voteType === "upVote" && voteType === "upVote"){
            newVoteType = "upUnclicked"
            tempVoteCount--
            newItem = await componentCheck(component)
            voteObj = {votes:tempVoteCount, voteType:null, voteId:null}
            return voteObj
        }else if(vote.voteType === "downVote" && voteType === "downVote"){
            newVoteType = "downUnclicked"
            tempVoteCount++
            newItem = await componentCheck(component)
            voteObj = {votes:tempVoteCount, voteType:null, voteId:null}
            return voteObj
        }else if(vote.voteType === "upVote" && voteType === "downVote"){
            newVoteType = "utoD"
            tempVoteCount-=2
            newItem = await componentCheck(component)
            voteObj = {votes:tempVoteCount, voteType:"downVote", voteId:vote.voteId}
            return voteObj
        }else if(vote.voteType === "downVote" && voteType === "upVote"){
            newVoteType = "dtoU"
            tempVoteCount+=2
            newItem = await componentCheck(component)
            voteObj = {votes:tempVoteCount, voteType:"upVote", voteId:vote.voteId}
            return voteObj
        }

}

export {voteInitializer, arrowHandler}