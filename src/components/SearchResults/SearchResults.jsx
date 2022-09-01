import React from 'react'
import CommunitiesCard from '../PostsPage/CommunitiesCard/CommunitiesCard'
import PostCard from '../PostCard/PostCard'

const SearchResults = ({setSub, currPosts, setPage, setSelectedUser}) => {

    return (
      <div className='post-page-flex'>
          <div className='post-page-div'>
  
              {currPosts.page.map((post)=>{
                  return (        
                      <PostCard 
                          setPage={setPage} post={post}
                          setSelectedUser={setSelectedUser} 
                          key={post._id} setSub={setSub}
                          />
                  )
              })}
  
          </div>
          <CommunitiesCard setSub={setSub} />
      </div>
  
    )
}

export default SearchResults