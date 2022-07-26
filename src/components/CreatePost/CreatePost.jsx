import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import './CreatePost.css'
import SubBlueCard from '../SubBlueCard/SubBlueCard'
import{ createPost }from '../../api/posts'
import { getSubs, getSubById } from '../../api/subs'
import "antd/dist/antd.css"
import { Cascader } from 'antd'
import { useEffect } from 'react'
const CreatePost = (props) => {

  const [selectedSub, setSelectedSub] = useState(null)
  const [formData, setFormData] = useState({})
  const [options, setOptions] = useState(null)
  const [droppedMenuTrue, setDroppedMenuTrue] = useState(false)
  const [selectedSubName, setSelectedSubName] = useState()

  const dropHandler=async()=>{
    let optionsCont = []
    subData = await getSubs();
    subData.subs.forEach((sub) =>{
      optionsCont.push({
        value: sub._id,
        label: sub.subName
      })
    setOptions([...optionsCont])

    })
  }

  useEffect(()=>{

    if(!options){
      dropHandler()
    }

  },[])

  const postTextHandler = (e) => {

    e.preventDefault()
    setFormData({ ...formData, [e.target.name]: e.target.value })

  }

  const handlePostSubmit =async(e) =>{
    e.preventDefault()
    try{
      await createPost({...formData, user:props.user.userId, username:props.user.username, sub:selectedSub[0], subName:selectedSubName})
    }catch(err){
      console.log(err)
    }

  }

  // const handleSubSelected=async(subId)=>{
  //   let currSub
  
  //   try{
  //     currSub = await getSubById(subId)
  //     setSelectedSub(currSub)
  //   }catch(err){
  //     console.log(err)
  //   }

  // }

  let subData 
  let dropMenu = null


  const dropChangeHandler=(value)=>{
    if(value){
      setSelectedSub(value)
    }
  }

  // if(selectedSub){
  //   selectedSubName = selectedSub.sub.subName
  //   selectedSubId = selectedSub.sub._id
  // }else{
  //   selectedSubName = false
  //   selectedSubId = false
  // }


  return (
    <div className='create-post-page'>
        
        <div className='create-post-div'>
            <div className='cascader-holder'>
              <Cascader placeholder="Select A Sub" options={options} onChange={dropChangeHandler}/>
            </div>
            <div className='create-post-head'>Create A Post</div>
            <form onSubmit={handlePostSubmit} className='create-post-form'>
                <input type="text" name="title" onChange={postTextHandler} />
                <textarea rows={6} name="text" onChange={postTextHandler} />
                <button type="submit" className='text-done-btn'>Done</button>
            </form>
        </div>
        
        <SubBlueCard selectedSub={selectedSub} setSelectedSubName={setSelectedSubName}  />
    </div>
  )
}

export default CreatePost