

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



export {login, signUp}