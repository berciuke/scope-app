"use client";
import useAuth from "./hooks/useAuth";
import PostForm from "./components/posts/PostForm";
import PostList from "./components/posts/PostList";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto p-4">
      {currentUser ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Witaj, {currentUser.firstName}!</h1>
          <PostForm />
          <PostList />
        </>
      ) : (
        <div className="flex flex-col items-center text-4xl gap-3">
          <h1 className="text-[var(--primary-color)]">Witaj na Scope!</h1>
          <a href="/login">Zaloguj lub zarejestruj się.</a>
        </div>
      )}
    </div>
  );
}
