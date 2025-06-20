// pages/posts/[slug].tsx

import { GetServerSideProps } from "next";
import clientPromise from "@/lib/mongodb";
import { Post } from "@/types/post";

interface PostPageProps {
  post: Post | null;
}

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="mb-6 rounded" />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p className="mt-6 text-gray-600 text-sm">
  Published on: {new Date(post.createdAt).toLocaleDateString("en-US")}
</p>

      {post.author && <p>Author: {post.author.name}</p>}
      {post.tags && post.tags.length > 0 && (
        <p>
          Tags:{" "}
          {post.tags.map((tag) => (
            <span key={tag} className="mr-2 text-blue-600">
              #{tag}
            </span>
          ))}
        </p>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    const client = await clientPromise;
    const db = client.db("football-blog");

    const post = await db
      .collection("posts")
      .findOne({ slug, published: true });

    if (!post) {
      return { props: { post: null } };
    }

    // Մաքրել ObjectId և Date դաշտերը
    const cleanedPost: Post = {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      coverImage: post.coverImage || null,
      author: post.author || null,
      createdAt:
        post.createdAt instanceof Date
          ? post.createdAt.toISOString()
          : post.createdAt,
      updatedAt:
        post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
      tags: post.tags ?? [],
      published: post.published,
    };

    return {
      props: { post: cleanedPost },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { props: { post: null } };
  }
};
