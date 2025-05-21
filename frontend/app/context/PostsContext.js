"use client";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";

export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { currentUser } = useAuth();
  const { createNotification } = useNotifications();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const extractTags = (content) => {
    const userList = JSON.parse(localStorage.getItem("users")) || [];
    const regex = /@(\w+)/g;
    let match;
    const tags = [];
    while ((match = regex.exec(content)) !== null) {
      const username = match[1];
      const foundUser = userList.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      if (foundUser && !tags.includes(foundUser.id)) {
        tags.push(foundUser.id);
      }
    }
    return tags;
  };

  const addPost = (content, targetType = "home", targetId = null) => {
    if (!currentUser) return;
    const tags = extractTags(content);
    const newPost = {
      id: uuidv4(),
      userId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      comments: [],
      tags,
      targetType,
      targetId,
    };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (postId, newContent) => {
    if (!currentUser) return;
    const tags = extractTags(newContent);
    const updatedPosts = posts.map((post) =>
      post.id === postId && post.userId === currentUser.id
        ? {
            ...post,
            content: newContent,
            updatedAt: new Date().toISOString(),
            tags,
          }
        : post
    );
    setPosts(updatedPosts);
  };

  const deletePost = (postId) => {
    if (!currentUser) return;
    const updatedPosts = posts.filter(
      (post) => !(post.id === postId && post.userId === currentUser.id)
    );
    setPosts(updatedPosts);
  };

  const addComment = (postId, commentContent) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const post = posts.find((post) => post.id === postId);
    if (post) {
      if (post.userId !== currentUser.id) {
        createNotification(
          "comment",
          `Użytkownik ${currentUser.firstName} ${currentUser.lastName} skomentował Twój post`,
          post.userId,
          post.id
        );
      }
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach((tagId) => {
          if (tagId !== currentUser.id) {
            createNotification(
              "comment",
              `Użytkownik ${currentUser.firstName} ${currentUser.lastName} skomentował post, w którym Cię oznaczono`,
              tagId,
              post.id
            );
          }
        });
      }
    }
    const comment = {
      id: uuidv4(),
      userId: currentUser.id,
      content: commentContent,
      createdAt: new Date().toISOString(),
    };
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    );
    setPosts(updatedPosts);
  };

  const toggleLike = (postId) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const post = posts.find((post) => post.id === postId);
    if (post) {
      if (post.userId !== currentUser.id) {
        createNotification(
          "like",
          `Użytkownik ${currentUser.firstName} ${currentUser.lastName} polubił Twój post`,
          post.userId,
          post.id
        );
      }
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach((tagId) => {
          if (tagId !== currentUser.id) {
            createNotification(
              "like",
              `Użytkownik ${currentUser.firstName} ${currentUser.lastName} polubił post, w którym Cię oznaczono`,
              tagId,
              post.id
            );
          }
        });
      }
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const alreadyLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter((id) => id !== currentUser.id)
            : [...post.likes, currentUser.id],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        addComment,
        toggleLike,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}
