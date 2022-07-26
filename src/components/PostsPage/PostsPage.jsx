import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom';
import './PostsPage.css'
import { getPosts, getPostsBySub } from '../../api/posts';
import { FireOutlined, StarOutlined, CheckSquareOutlined, UpOutlined } from '@ant-design/icons';
import PostCard from '../PostCard/PostCard';

const PostsPage = ({currPosts, setCurrPosts, page, setPage, setSelectedUser, user, setSub, sortMethod, setSortMethod, setUser}) => {

    
    const [offset, setOffset] = useState(0)
    const [checkSort, setCheckSort] = useState("votes")

    const currPostRef = useRef()
    currPostRef.current = currPosts

    const callGetPost = async(offsetInput)=>{
        let offCont = offsetInput
        let currPostCont = currPostRef.current

        if( sortMethod!==checkSort && currPosts.page.length !== 0){
            offCont = 0;
            setCheckSort(sortMethod)
            currPostCont = {page:[]}
        }

        try{
            let postArr = await getPosts(sortMethod, offCont)

            if( !currPostRef.current.page[0] || currPostRef.current.page[0]._id === postArr.page[0]._id){
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
            let currOffset = offset+9
            setOffset(currOffset)
        }
    }

    useEffect(()=>{
        window.addEventListener('scroll', handleScroll)
    },[]) 

    useEffect(()=>{

    // if(sortMethod !== checkSort){
    //     setOffset(0)
    //     setCheckSort(sortMethod)
    // }    

    if(page === "home"){
        callGetPost(offset)
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
        <div className='post-page-user-card'>
            <div>
                <div className="card-label-pp">
                    Top Communities
                </div>
                <div className='community-sub-card'>
                    <p>1</p>
                    <UpOutlined 
                        style={{
                            color:"#47D160", 
                            strokeWidth:"40",
                            stroke:"#47D160"
                            }}/>
                    <p>AITA</p>
                </div>
                <div className='community-sub-card'>
                    <p>2</p>
                    <UpOutlined 
                        style={{
                            color:"#47D160", 
                            strokeWidth:"40",
                            stroke:"#47D160"
                            }}/>
                    <p>ASKREDDIT</p>
                </div>
                <div className='community-sub-card'>
                    <p>3</p>
                    <UpOutlined 
                        style={{
                            color:"#47D160", 
                            strokeWidth:"40",
                            stroke:"#47D160"
                            }}/>
                    <p>BOOKS</p>
                </div>
            </div>
            
            <div className='see-all-button' >
                See All Communities
            </div>
        </div>
    </div>

  )
}

export default PostsPage;