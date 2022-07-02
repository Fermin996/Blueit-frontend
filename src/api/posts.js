
const getPosts= async(sortBy)=>{
    console.log(sortBy)
    try{
        const response = await fetch('http://localhost:5000/posts/sort/'+sortBy, {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}   

const createPost = async(post) =>{

    try{
        console.log("this worked")
        const response = await fetch('http://localhost:5000/posts/', {
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
        const response = await fetch('http://localhost:5000/posts/'+postId, {
            method:"GET"
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }

}

const getPostsBySub=async(subId)=>{
    try{
        const response = await fetch('http://localhost:5000/posts/sub/'+subId, {
            method:"GET"
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const getPostsByUser=async(userId)=>{
    try{
        const response = await fetch('http://localhost:5000/posts/user/'+userId, {
            method:"GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const updateVotes=async(userId, voteType, postId, voteId)=>{
    try{
        const response = await fetch('http://localhost:5000/posts/votes/'+postId, {
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


export {createPost, getPosts, getPostById, getPostsBySub, getPostsByUser, updateVotes}