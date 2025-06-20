"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
const UPLOAD_PRESET = "unsigned_preset"; // դարձրու քո Upload preset անունը

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your new post here...</p>",
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to access the admin panel.</p>;

  // Նկար ֆայլ ընտրելու համար handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setCoverImage(data.secure_url);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim() || !editor) {
      setError("Please fill in the title, slug, and content.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content: editor.getHTML(),
          coverImage,
          published: true,  // <-- այստեղ ավելացնում ես
        }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error saving the post");
      }
  
      setTitle("");
      setSlug("");
      setCoverImage("");
      editor.commands.clearContent();
      alert("Post created successfully!");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - New Post</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <input
        type="text"
        placeholder="Slug (e.g., my-first-post)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {/* Նկար ֆայլ ընտրելու input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Նկար preview */}
      {coverImage && (
        <img
          src={coverImage}
          alt="Cover preview"
          className="mb-4 max-h-48 object-contain rounded border"
        />
      )}

      <div className="border rounded p-2 mb-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
    </main>
  );
}
