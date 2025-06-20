// pages/posts/[slug].tsx

import { GetServerSideProps } from "next";
import { Post } from "@/types/post";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Image from "next/image";

interface PostPageProps {
  post: Post | null;
}

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={800}
          height={400}
          className="mb-6 rounded"
        />
      )}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <p className="mt-6 text-gray-600">
        By {post.author?.name || "Unknown"} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </main>
  );
}

// Server-side rendering, կարող ես նաև օգտագործել getStaticProps + getStaticPaths եթե ուզում ես Static Generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  const client = await clientPromise;
  const db = client.db("football-blog");

  const post = await db.collection("posts").findOne({ slug, published: true });

  if (!post) {
    return {
      notFound: true,
    };
  }

  // Կատարում ենք MongoDB ObjectId և Date դաշտերի վերափոխում
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
    tags: post.tags || [],
    published: post.published,
  };

  return {
    props: {
      post: cleanedPost,
    },
  };
};
