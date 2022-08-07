import React, {useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import './PostsPage.css'
import { getPosts, getPostsBySub } from '../../api/posts';
import { FireOutlined, StarOutlined, CheckSquareOutlined, UpOutlined } from '@ant-design/icons';
import PostCard from '../PostCard/PostCard';
import CommunitiesCard from './CommunitiesCard/CommunitiesCard';

const PostsPage = ({currPosts, setCurrPosts, page, setPage, setSelectedUser, user, setSub, setUser}) => {

    
    const [offset, setOffset] = useState(0)
    const [checkSort, setCheckSort] = useState("date")
    const [sortMethod, setSortMethod] = useState("date")

    const currPostRef = useRef()
    currPostRef.current = currPosts

    const offsetRef = useRef()
    offsetRef.current=offset

    
    const callGetPost = async()=>{

        let currPostCont = currPostRef.current

        if( sortMethod!==checkSort && currPosts.page.length !== 0){
            setOffset(0)
            setCheckSort(sortMethod)
            currPostCont = {page:[]}
            setCurrPosts({page:[]})
        }

        try{
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
                        setSelectedUser={setSelectedUser} 
                        key={post._id} setSub={setSub} setUser={setUser}
                        />
                )
            })}

        </div>
        <CommunitiesCard setSub={setSub} />
    </div>

  )
}

export default PostsPage;