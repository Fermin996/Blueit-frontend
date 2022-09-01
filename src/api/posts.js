
const getPosts= async(sortBy, start)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/sort/'+sortBy+"/"+start, {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}   

const searchPost=async(string)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/search/'+string, {
            method: "GET"
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const createPost = async(post) =>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/', {
            method: "POST",
            headers:{
                //Authorization: "Bearer " + token,
                Accept: "application/json",
                "Content-type":"application/json"

            },
            body:JSON.stringify(post)
        })

        return await response.json()

    }catch(err){
        console.log(err)
    }

}

const getPostById =async(postId)=>{

    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/'+postId, {
            method:"GET"
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }

}

const getPostsBySub=async(subId)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/sub/'+subId, {
            method:"GET"
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const getPostsByUser=async(userId)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/user/'+userId, {
            method:"GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const updateVotes=async(userId, voteType, postId, voteId)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/votes/'+postId, {
            method: "PATCH",
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

const editPost=async(postId, postText)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/'+postId, {
            method: "PATCH",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({postText})
        })

        return response.json()
    }catch(err){
        console.log(err)
    }
}

const deletePost=async(postId)=>{
    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/posts/'+postId, {
            method: "DELETE"
        })
        return response.json()
    }catch(err){
        console.log(err)
    }
}

export {createPost, getPosts, getPostById, getPostsBySub, getPostsByUser, updateVotes, editPost, deletePost, searchPost}