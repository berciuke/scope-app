"use client";
import { useState, useMemo } from "react";
import usePosts from "../../hooks/usePosts";
import useAuth from "../../hooks/useAuth";
import Post from "./Post";
import PostForm from "./PostForm";
import FullPostModal from "./FullPostModal";
import useGroups from "../../hooks/useGroups";

export default function PostList() {
  const { posts, deletePost } = usePosts();
  const { currentUser } = useAuth();
  const { groups } = useGroups();
  const [editingPostId, setEditingPostId] = useState(null);
  const [modalPost, setModalPost] = useState(null);

  const handleEdit = (postId) => {
    setEditingPostId(postId);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  const sortedPosts = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [posts]);

  return (
    <div className="post-list">
      {sortedPosts.map((post) =>
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
            onEdit={
              currentUser && currentUser.id === post.userId ? handleEdit : null
            }
            onDelete={
              currentUser && currentUser.id === post.userId ? deletePost : null
            }
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
