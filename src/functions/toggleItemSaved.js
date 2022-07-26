import { saveItem, deleteItem } from "../api/users"



export const toggleItemSaved=async(userId, itemId, itemType, saved)=>{
    console.log(saved)
    let itemObj
    if(saved){
        itemObj = await deleteItem(userId, itemId, itemType)
        console.log("I RAM")
        console.log(itemObj)
        return itemObj
    }else{
        itemObj =  await saveItem(userId, itemId, itemType)
        console.log("I RAM")
        console.log(itemObj)
        return itemObj
    }

}
