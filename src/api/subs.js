const getSubs = async()=>{

    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/sub/', {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const getSubById = async(subId)=>{

    try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/sub/'+subId,{
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}

export { getSubs, getSubById }