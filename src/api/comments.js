const getCommentsByParent = async(parentId)=>{

    try{
        const response = await fetch('http://localhost:5000/comments/parent/'+parentId, {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}

const getCommentById = async(commentId)=>{
    try{
        const response = await fetch('http://localhost:5000/comments/'+commentId, {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }


}

const getCommentsByPost = async(postId)=>{

    try{
        const response = await fetch('http://localhost:5000/comments/post/'+postId, {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}

const createComment = async(commentData)=>{

    try{
        const response = await fetch('http://localhost:5000/comments/', {
            method:"POST",
            headers:{
                //Authorization: "Bearer " + token,
                Accept: "application/json",
                "Content-type":"application/json"

            },
            body:JSON.stringify(commentData)
        })
    }catch(err){
        console.log(err)
    }

}

const getCommentsByUser=async(userId)=>{
    try{
        const response= await fetch('http://localhost:5000/comments/user/'+userId, {
            method:"GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const changeCommentVotes=async(userId, voteType, commentId, voteId)=>{

    try{
        const response = await fetch('http://localhost:5000/comments/votes/'+commentId, {
            method:"PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({userId, voteType, voteId})
        })

        return response.json()
    }catch(err){
        console.log(err)
    }

}

const editComment=async(commentId, text)=>{
    console.log(commentId)
    try{
        const response = await fetch('http://localhost:5000/comments/'+commentId, {
            method:"PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({text})
        })

        return response.json()  
    }catch(err){
        console.log(err)
    }
}

const deleteComment=async(commentId)=>{
    try{
        const response = await fetch('http://localhost:5000/comments/'+commentId, {
            method:"DELETE"
        })
        return response.json()
    }catch(err){
        console.log(err)
    }
}

export { 
    createComment, getCommentsByParent, getCommentsByPost, 
    getCommentsByUser, changeCommentVotes, editComment, deleteComment, 
    getCommentById
}