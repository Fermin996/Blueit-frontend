import React, {useState, useEffect} from 'react'

import { Link, useNavigate } from 'react-router-dom';
import {getSubs} from "../../../api/subs"
import { UpOutlined } from '@ant-design/icons';

const CommunitiesCard = ({setSub}) => {
    const navigate = useNavigate()
    const [communitiesButtonClicked, setCommunitiesButtonClicked] = useState(false)
    const [subsInCard, setSubsInCard] = useState(null)

    const callGetSubs =async()=>{
        let subsCont
        let sliceIndex
        console.log(communitiesButtonClicked)
        sliceIndex = communitiesButtonClicked ? 10 : 6
        console.log(sliceIndex)
        subsCont = await getSubs()
        subsCont.subs = subsCont.subs.slice(0,sliceIndex)
        setSubsInCard(subsCont)
    }

    useEffect(()=>{
        console.log("i ran")
        callGetSubs()
    },[communitiesButtonClicked])

    const subCardHandler=(subD)=>{
        setSub(subD._id)
        navigate("/sub-view")
       }

  return (
    <div className='post-page-user-card'>
        <div>
            <div className="card-label-pp">
                Communities
            </div>
            <div className='community-sub-card'></div>
            {subsInCard ? subsInCard.subs.map((sub) => {
                return <div onClick={()=>subCardHandler(sub)} className='community-sub-card'>
                <p>{subsInCard.subs.indexOf(sub)+1}</p>
                <UpOutlined 
                    style={{
                        color:"#47D160", 
                        strokeWidth:"40",
                        stroke:"#47D160"
                        }}/>
                <p>{sub.subName}</p>
            </div>
            }) : null}
        </div>
        
        {communitiesButtonClicked ? null : (
        <div className='see-all-button' onClick={()=>setCommunitiesButtonClicked(true)} >
            See All Communities
        </div>
        )}
    </div>
  )
}

export default CommunitiesCard