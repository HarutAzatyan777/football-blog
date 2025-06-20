import { useEffect, useState } from "react";
import PostItem from "@/components/PostItem";
import { Post } from "@/types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (err) {
        setError("Failed to load posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Football Blog</h1>

      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => <PostItem key={post._id} post={post} />)
      )}
    </main>
  );
}
