

const signUp = async (user) => {
    let userCont = user
    if(!user){
        userCont = {email:false, password:false, username:false}
    }

    console.log(userCont)

    try{
        const resp = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { 
            Accept: "application/json",
            "Content-type":"application/json"
        },
        body: JSON.stringify(userCont)
        })
        return await resp.json();
    }catch(err){
        console.log(err)
    }

    
    
}


const login = async (user) =>{
    let userCont = user
    if(!user){
        userCont = {email:false, password:false}
    }

    try{
        const response = await fetch("http://localhost:5000/user/login", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(userCont)

        })

        return await response.json()

    }catch(err){
        console.log(err)
    }

}

const getUser = async(userId) =>{
    console.log(userId)
    try {
        const response = await fetch("http://localhost:5000/user/"+userId, {
            method: "GET"
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

const getSavedItems = async(userId) =>{
    try {
        const response = await fetch("http://localhost:5000/user/save/"+userId, {
            method: "GET"
        })
        return await response.json()
    } catch (error) {
        
    }
}


const saveItem = async(userId, itemId, type)=>{
    console.log(userId)
    try{
        const response = await fetch("http://localhost:5000/user/save/"+userId, {
            method:"PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({itemId, type})
        })

        return response.json()
    }catch(err){
        console.log(err)
    }

}

const deleteItem = async(userId, itemId, type)=>{

    try{
        const response = await fetch("http://localhost:5000/user/delete-saved/"+userId, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({itemId, type})
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}

const editUserBio= async(bioText, userId)=>{

    console.log(bioText)
    console.log(userId)

    try{
        const response = await fetch("http://localhost:5000/user/bio-edit/"+userId, {
            method: "PATCH",
            headers:{
                Accept:"application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({bio: bioText})
        })
        return await response.json()
    }catch(err){
        console.log(err)
    }

}




export {login, signUp, saveItem, deleteItem, getSavedItems, getUser, editUserBio}