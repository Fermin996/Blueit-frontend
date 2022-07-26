

const signUp = async (user) => {

    try{
        const resp = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { 
            Accept: "application/json",
            "Content-type":"application/json"
        },
        body: JSON.stringify(user)
        })
        return await resp.json();
    }catch(err){
        console.log(err)
    }

    
    
}


const login = async (user) =>{
    
    try{
        const response = await fetch("http://localhost:5000/user/login", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(user)

        })

        return await response.json()

    }catch(err){
        console.log(err)
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




export {login, signUp, saveItem, deleteItem, getSavedItems}