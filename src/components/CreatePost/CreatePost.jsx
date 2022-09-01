import React, {useState, useEffect, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CreatePost.css'
import SubBlueCard from '../SubBlueCard/SubBlueCard'
import{ createPost }from '../../api/posts'
import { getSubs, getSubById } from '../../api/subs'
import "antd/dist/antd.css"
import { Cascader } from 'antd'
import { UserContext } from '../../helpers/user-context'


const CreatePost = (props) => {

  const navigate = useNavigate()

  const userCtx = useContext(UserContext)

  const [selectedSub, setSelectedSub] = useState(null)
  const [formData, setFormData] = useState({})
  const [options, setOptions] = useState(null)
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
    let createdPost
    e.preventDefault()
    try{
      createdPost = await createPost({...formData, user:userCtx.userId, username:userCtx.userName, sub:selectedSub[0], subName:selectedSubName})
      props.setPage(createdPost.post._id)
      navigate('/post-view')
    }catch(err){
      console.log(err)
    }

  }


  let subData 


  const dropChangeHandler=(value)=>{
    if(value){
      setSelectedSub(value)
    }
  }


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