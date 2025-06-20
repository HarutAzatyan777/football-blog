// pages/api/posts.ts

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { Post } from "@/types/post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ posts?: Post[]; message?: string; error?: string }>
) {
  try {
    const client = await clientPromise;
    const db = client.db("football-blog");
    const postsCollection = db.collection("posts");

    switch (req.method) {
      case "GET": {
        const posts = await postsCollection
          .find({ published: true })
          .sort({ createdAt: -1 })
          .toArray();

        const cleanedPosts: Post[] = posts.map((post: any) => ({
          _id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          content: post.content,
          coverImage: post.coverImage || "",
          author: post.author || null,
          createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
          updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
          tags: Array.isArray(post.tags) ? post.tags : [],
          published: !!post.published,
        }));

        return res.status(200).json({ posts: cleanedPosts });
      }

      case "POST": {
        const { title, slug, content, coverImage, author, tags, published } = req.body;

        if (!title?.trim() || !slug?.trim() || !content?.trim()) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newPost = {
          title: title.trim(),
          slug: slug.trim(),
          content,
          coverImage: coverImage || null,
          author: author || null,
          tags: Array.isArray(tags) ? tags : [],
          published: !!published,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await postsCollection.insertOne(newPost);

        if (!result.insertedId) {
          return res.status(500).json({ error: "Failed to insert post" });
        }

        return res.status(201).json({ message: "Post created successfully" });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
