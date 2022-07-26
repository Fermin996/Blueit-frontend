
export const timeCheck=(inDate)=>{

    let newDate = new Date()
    let postDate = new Date(inDate)
    let diff = Math.abs(newDate - postDate)

    if(diff > (86400000)){
        diff = Math.floor(diff/=(1000*60*60*24))
        return diff +" days ago"
    }else if(diff > (3600000)){
        diff = Math.floor(diff/=(1000*60*60))
        return diff +" hours ago"
    }else if(diff > 60000){
        diff = Math.floor(diff/=(1000*60))
        return diff +" minutes ago"
    }else{
        return "Now"
    }

}