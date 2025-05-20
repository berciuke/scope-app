"use client";
import Comment from "./Comment";

export default function CommentList({ comments, limit }) {
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const commentsToShow =
    typeof limit === "number" ? sortedComments.slice(0, limit) : sortedComments;

  return (
    <div className="border-t pt-2 mt-2">
      {commentsToShow.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
