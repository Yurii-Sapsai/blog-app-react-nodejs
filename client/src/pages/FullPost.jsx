import React from "react";
import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

import { useParams } from "react-router-dom";
import axios from '../axios'

export const FullPost = () => {

  const {id} = useParams()
  const [post, setPost] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(()=>{
    axios.get(`/posts/${id}`)
         .then(post => {
          setPost(post.data)
          setLoading(false)
         })
         .catch((err)=>{
              console.warn(err)
              console.log('Get post is failed')
         })
  },[])

  console.log(post)
  if(isLoading){
    return <Post isLoading={isLoading}/>
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <p>
          {post.text}
        </p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
