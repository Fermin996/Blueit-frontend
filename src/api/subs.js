const getSubs = async()=>{

    try{
        const response = await fetch('http://localhost:5000/sub/', {
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }
}

const getSubById = async(subId)=>{

    try{
        const response = await fetch('http://localhost:5000/sub/'+subId,{
            method: "GET"
        })

        return await response.json()
    }catch(err){
        console.log(err)
    }

}

export { getSubs, getSubById }