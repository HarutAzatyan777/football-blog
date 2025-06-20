import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/post";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <article className="mb-8 border-b pb-4">
      <h2 className="text-2xl font-semibold mb-2">
        <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* Եթե coverImage կա, ցույց տալ նկարը */}
      {post.coverImage && (
        <div className="mb-4">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={400}
            className="rounded object-cover w-full h-auto"
          />
        </div>
      )}

      <div
        className="line-clamp-3 text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <p className="text-sm text-gray-600 mt-2">
        By <span className="font-medium">{post.author?.name || "Unknown"}</span> on{" "}
        {new Date(post.createdAt).toLocaleDateString("en-GB")}
      </p>
    </article>
  );
}
