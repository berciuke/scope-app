"use client";

import { useState, useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import useAuth from "../../hooks/useAuth";
import Post from "../posts/Post";
import PostForm from "../posts/PostForm";
import FullPostModal from "../posts/FullPostModal";

export default function GroupPostList({ groupId }) {
    const { posts, deletePost } = usePosts();
    const { currentUser } = useAuth();
    const [editingPostId, setEditingPostId] = useState(null);
    const [modalPost, setModalPost] = useState(null);
    const groupPosts = posts.filter(post => post.targetType === 'group' && post.targetId === groupId)

    const handleEdit = (postId) => {
      setEditingPostId(postId);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
    };

    return (
      <div className="post-list">
           <PostForm targetType="group" targetId={groupId} />
        {groupPosts.length === 0 && <p>Brak postów</p>}
        {groupPosts.map((post) =>
          editingPostId === post.id ? (
            <PostForm
              key={post.id}
              existingPost={post}
              onSave={handleCancelEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <Post
              key={post.id}
              post={post}
              onEdit={currentUser && currentUser.id === post.userId ? handleEdit : null}
              onDelete={currentUser && currentUser.id === post.userId ? deletePost : null}
              openModal={(post) => setModalPost(post)}
            />
          )
        )}
        {modalPost && (
          <FullPostModal post={modalPost} onClose={() => setModalPost(null)} />
        )}
      </div>
    );
}