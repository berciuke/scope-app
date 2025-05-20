"use client";
import { useState } from "react";
import Image from "next/image";
import useAuth from "../../hooks/useAuth";
import usePosts from "../../hooks/usePosts";
import useReports from "../../hooks/useReports";
import useGroups from "../../hooks/useGroups";
import CommentList from "./comments/CommentList";
import CommentForm from "./comments/CommentForm";

export default function Post({
  post,
  onEdit,
  onDelete,
  fullView = false,
  openModal,
}) {
  const { currentUser } = useAuth();
  const { toggleLike } = usePosts();
  const { reportContent } = useReports();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isPostExpanded, setIsPostExpanded] = useState(fullView);
  const { groups } = useGroups();
  let groupInfo = null;
  if (post.targetType === "group") {
    groupInfo = groups.find((g) => g.id === post.targetId);
  }
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === post.userId);

  const shouldTruncatePost = post.content.length > 240 && !isPostExpanded;
  const displayedPostContent = shouldTruncatePost
    ? post.content.substring(0, 240) + "..."
    : post.content;

  const isLiked = currentUser && post.likes.includes(currentUser.id);

  const handleToggleLike = () => {
    toggleLike(post.id);
  };

  const handleContentClick = () => {
    if (!fullView && openModal) {
      openModal(post);
    }
  };

  const handleReport = (contentType, contentId) => {
    if (!currentUser) return;
    const reason = prompt("Podaj powód zgłoszenia:");
    if (reason) {
      reportContent(contentType, contentId, currentUser.id, reason);
      alert("Zgłoszono!");
    }
  };

  return (
    <div className="bg-[#403d39] shadow rounded p-4 mb-4">
      <div className="flex items-center mb-2">
        {user && (
          <Image
            src={user.photo || "/profile-picture.jpg"}
            alt={user.username}
            width={48}
            height={48}
            className="profile-picture-small mr-2"
          />
        )}
        <div>
          <a
            className="font-bold"
            href={`/profile/${user ? user.username : ""}`}
          >
            {user
              ? `${user.firstName} ${user.lastName}`
              : "Nieznany użytkownik"}
          </a>
          {groupInfo && (
            <div className="text-sm text-gray-500">
              Post z grupy: {groupInfo.name}
            </div>
          )}
          <div className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          {onEdit && currentUser && currentUser.id === post.userId && (
            <>
              <button
                onClick={() => onEdit(post.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edytuj
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="post-content mb-2 whitespace-pre-wrap cursor-pointer"
        onClick={handleContentClick}
        title="Kliknij, aby przejść do pełnego widoku"
      >
        {displayedPostContent}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="tags mt-2">
          <span className="text-sm text-blue-300">Oznaczono: </span>
          {post.tags.map((tagUserId) => {
            const taggedUser = users.find((u) => u.id === tagUserId);
            if (!taggedUser) return null;
            return (
              <a
                key={tagUserId}
                href={`/profile/${taggedUser.username}`}
                className="text-sm text-blue-400 ml-1"
              >
                @{taggedUser.username}
              </a>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleToggleLike}
          className={`px-3 py-1 rounded ${
            isLiked ? "bg-green-500 text-white" : "text-white"
          }`}
        >
          {isLiked ? "👍 Lubisz to!" : "👍 Lubię to!"}
        </button>
        <span className="text-sm text-white">
          {post.likes.length === 0 ? "Brak" : post.likes.length}{" "}
          {post.likes.length === 1 ? "polubienie" : "polubień"}
        </span>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Komentuj
        </button>
        <button
          onClick={() => handleReport("post", post.id)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Zgłoś
        </button>
      </div>

      {showCommentForm && (
        <CommentForm
          postId={post.id}
          onCancel={() => setShowCommentForm(false)}
        />
      )}

      <CommentList comments={post.comments} limit={fullView ? undefined : 2} />

      {!fullView && post.comments.length > 2 && openModal && (
        <button onClick={() => openModal(post)} className="text-sm mt-2">
          Wszystkie komentarze
        </button>
      )}
    </div>
  );
}
