import { saveItem, deleteItem } from "../api/users"



export const toggleItemSaved=async(userId, itemId, itemType, saved)=>{
    let itemObj
    if(saved){
        itemObj = await deleteItem(userId, itemId, itemType)
        return itemObj
    }else{
        itemObj =  await saveItem(userId, itemId, itemType)
        return itemObj
    }

}
