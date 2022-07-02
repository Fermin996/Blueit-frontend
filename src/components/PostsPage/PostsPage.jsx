import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import './PostsPage.css'
import dummyPosts from '../../dummyPosts'
import { getPosts, getPostsBySub } from '../../api/posts';
import { FireOutlined, StarOutlined, CheckSquareOutlined } from '@ant-design/icons';
import PostCard from '../PostCard/PostCard';

const PostsPage = ({currPosts, setCurrPosts, page, setPage, setSelectedUser, user}) => {

    // const [divBtnClicked, setDivBtnClicked] = useState('new')
    const [sortMethod, setSortMethod] = useState("date")

   useEffect(()=>{
       
    const callGetPost = async()=>{
        console.log("post sort updated")
        try{
           setCurrPosts( await getPosts(sortMethod))
           console.log(currPosts)
        }catch(err){
            console.log(err)
        }

    }

    if(page === "home"){
        callGetPost()
    }



   },[page, sortMethod])

    // function sendCurrPosts(){
    //     console.log(page)
    //     let tempPosts = dummyPosts.filter(post => post.subBlueit === page)
    //     setCurrPosts([...tempPosts])
    // }
    

//    const subClickedHandler=async(clickedSub)=>{
//         // let tempPosts = dummyPosts.filter(post => post.subBlueit === clickedSub)
//         // let tempPosts = await getPostsBySub(clickedSub)
//         //console.log(tempPosts.page)
//         // setCurrPosts(tempPosts)
//    }
   
//    let sortButtonStyle="div-sort-btn"

//    if(divBtnClicked){
//     sortButtonStyle = "div-sort-btn-clicked"
//    }

  return (

    <div className='post-page-div'>
        <Link to="/create-post" className='new-post-btn'>
            Create New Post
        </Link>
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
        </div>

        {currPosts.page.map((post)=>{
            return (                
                // <Link className='post-div' to="/post-view" onClick={()=>setPage(post._id)}>
                //     <div className='post-votes-div'>
                //         <div className='posts-votes-sub-div'>+</div>
                //         <div className='posts-votes-sub-div'>{post.votes}</div>
                //         <div className='posts-votes-sub-div'>-</div>
                //     </div>
                //     <div className='post-content'>
                //         <div className='post-info'>
                //             <Link className='post-sub' to='/' onClick={()=>subClickedHandler(post.sub)} >b/{post.sub}</Link>
                //             <Link className='post-user' to='/user-profile' onClick={()=>setSelectedUser(post.user)} >u/{post.username}</Link>
                //         </div>
                //         <div className='post-media'>
                //             <h3 className='post-title'>{post.title}</h3>
                //             <div className='post-text'>{post.text}</div>
                //         </div>
                //         <div className='post-options'>
                //             <div className='post-options-btn'>{post.comments.length} Comments</div>
                //             <div className='post-options-btn'>Save</div>
                //         </div>
                //     </div>
                // </Link>
                <PostCard 
                    setPage={setPage} post={post}
                    setSelectedUser={setSelectedUser} user={user}
                    key={post._id}
                    />
            )
        })}

    </div>

  )
}

export default PostsPage;