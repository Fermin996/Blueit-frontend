import React, { useEffect, useState} from 'react'
import { getSubById } from '../../api/subs'
import dummySubs from '../../dummySubs'
import './SubBlueCard.css'


const SubBlueCard = (props) => {
    
    const [currentSub, setCurrSub] = useState(null)
    console.log(props.selectedSub)
  const getSubCard=async()=>{
    let subCont

    try{
        subCont = await getSubById(props.selectedSub)
        setCurrSub(subCont.sub)
        props.setSelectedSubName(subCont.sub.subName)
    }catch(err){
        console.log(err)
    }
  }

  useEffect(()=>{

    if(props.selectedSub){
        getSubCard()
    }

  },[props.selectedSub])
  
//   if(props.selectedSub){
//       currentSub = props.selectedSub.sub
//   }

  function numToString(num) {
    let frontNum;
    if(num >= 1000000){
        frontNum = Math.round(num/1000000)

        return frontNum.toString() + "m"
    }else if(num>=1000){
        frontNum = Math.round(num/1000)
        
        return frontNum.toString() + "K"
    }else{
        return num
    }

  }

  let currSubView = (
    <div className='sub-card-div'> 
        <div className='sub-info-card'>
           A sub hasnt been selected yet 
        </div>
    </div>
  )

  if(currentSub){

    currSubView = (
        <div className='sub-card-div'>
        <div className='sub-info-card'>
            <div className='sub-card-top'>About Community</div>
            <div className='sub-card-title'>
                <p>
                    b/{currentSub.subName}
                </p>    
            </div>
            <div className='sub-info-div'>
                {currentSub.subInfo}
            </div>
            <div className='sub-count-div'>{numToString(currentSub.memberCount)} Members</div>
            <div className='sub-cake-div'>Created {currentSub.cakeDay}</div>
        </div>
        <div className='sub-rules-div'>
            <div className='sub-card-title'>b/{currentSub.subName} Rules</div>
            {/* {currentSub.rules.map((rule) => {
                return <div className='sub-rule'>{currentSub.rules.indexOf(rule)+1}. {rule}</div>
            })} */}
        </div>
        </div>
    )

  }

  return (
    <>
        {currSubView}
    </>  
  )
}

export default SubBlueCard