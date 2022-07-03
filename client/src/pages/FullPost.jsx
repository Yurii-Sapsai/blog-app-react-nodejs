import React from "react";
import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from 'react-markdown';
import { useParams } from "react-router-dom";
import axios from '../axios'

export const FullPost = () => {

  const { id } = useParams()
  const [post, setPost] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(post => {
        setPost(post.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        console.log('Get post is failed');
      })
  }, [])

  if (isLoading) {
    return <Post isLoading={isLoading} />
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={`http://localhost:4444${post.imageUrl}`}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "David",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "text",
          },
          {
            user: {
              fullName: "Mike",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "text",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
