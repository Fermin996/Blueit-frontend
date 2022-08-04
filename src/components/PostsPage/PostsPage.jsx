import React, {useState, useEffect, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './PostsPage.css'
import { getPosts, getPostsBySub } from '../../api/posts';
import { getSubs } from "../../api/subs"
import { FireOutlined, StarOutlined, CheckSquareOutlined, UpOutlined } from '@ant-design/icons';
import PostCard from '../PostCard/PostCard';
import CommunitiesCard from './CommunitiesCard/CommunitiesCard';

const PostsPage = ({currPosts, setCurrPosts, page, setPage, setSelectedUser, user, setSub, setUser}) => {

    const navigate = useNavigate()
    
    const [offset, setOffset] = useState(0)
    const [checkSort, setCheckSort] = useState("date")
    const [sortMethod, setSortMethod] = useState("date")

    const currPostRef = useRef()
    currPostRef.current = currPosts

    const offsetRef = useRef()
    offsetRef.current=offset


    // const callGetSubs =async()=>{
    //     let subsCont
    //     let sliceIndex
    //     sliceIndex = communitiesButtonClicked ? 10 : 6
    //     subsCont = await getSubs()
    //     subsCont.subs = subsCont.subs.slice(0,6)
    //     setSubsInCard(subsCont)
    // }
    
    const callGetPost = async()=>{

        let currPostCont = currPostRef.current

        if( sortMethod!==checkSort && currPosts.page.length !== 0){
            setOffset(0)
            setCheckSort(sortMethod)
            currPostCont = {page:[]}
            setCurrPosts({page:[]})
        }

        try{
            console.log(offset)
            let postArr = await getPosts(sortMethod, offset)
            if( !currPostCont.page[0] || !currPostRef.current.page[0] || currPostRef.current.page[0]._id === postArr.page[0]._id){
                setCurrPosts( 
                    {
                        page:[...postArr.page]
                    }
                )
            }else{
                setCurrPosts( 
                    {
                        page:[...currPostCont.page, ...postArr.page]
                    }
                )
            }
            
        }catch(err){
            console.log(err)
        }
    }

    const handleScroll=(e)=>{
        if(window.innerHeight + e.target.documentElement.scrollTop >= e.target.documentElement.scrollHeight ){
            setOffset(offsetRef.current+4)
        }
    }

    useEffect(()=>{
        window.addEventListener('scroll', handleScroll)
    },[]) 

    useEffect(()=>{
        // callGetSubs()
        if(page === "home"){
            callGetPost()
        }
   },[page, sortMethod, offset])    



  return (
    <div className='post-page-flex'>
        <div className='post-page-div'>
            
            <div className='post-sort-btns'>
                <div className={ sortMethod === "hot" ? "div-sort-btn-clicked" : "div-sort-btn"} onClick={()=>setSortMethod('date')}>
                    <FireOutlined />
                    <p>Hot</p>
                </div>
                <div className={ sortMethod === "date" ? "div-sort-btn-clicked" : "div-sort-btn"} onClick={()=>setSortMethod('date')}>
                    <CheckSquareOutlined />
                    <p>New</p>
                </div>
                <div className={ sortMethod === "votes" ? "div-sort-btn-clicked" : "div-sort-btn"} onClick={()=>setSortMethod('votes')}>
                    <StarOutlined />
                    <p>Top</p>
                </div>
                <Link to="/create-post" className='new-post-btn'>
                    Create New Post +
                </Link>
            </div>

            {currPosts.page.map((post)=>{
                return (        
                    <PostCard 
                        setPage={setPage} post={post}
                        setSelectedUser={setSelectedUser} user={user}
                        key={post._id} setSub={setSub} setUser={setUser}
                        />
                )
            })}

        </div>
        <CommunitiesCard setSub={setSub} />
        {/* <div className='post-page-user-card'>
            <div>
                <div className="card-label-pp">
                    Communities
                </div>
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
        </div> */}
    </div>

  )
}

export default PostsPage;