import { useState, useEffect } from "react";

export default function AdminContent() {
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
      setPosts(storedPosts);
    }, []);
  
    const handleDeletePost = (postId) => {
      if (confirm("Czy na pewno chcesz usunąć ten post?")) {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        alert("Post został usunięty.");
      }
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Zarządzanie treściami</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Autor</th>
              <th className="border px-4 py-2">Treść</th>
              <th className="border px-4 py-2">ID Treści</th>
              <th className="border px-4 py-2">Data utworzenia</th>
              <th className="border px-4 py-2">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="border px-4 py-2">{post.userId}</td>
                <td className="border px-4 py-2">
                  {post.content.length > 50
                    ? post.content.substring(0, 50) + "..."
                    : post.content}
                </td>
                <td className="border px-4 py-2">{post.id}</td>
                <td className="border px-4 py-2">
                  {new Date(post.createdAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

