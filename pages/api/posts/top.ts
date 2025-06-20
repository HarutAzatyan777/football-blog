// pages/api/posts/top.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { Post } from "@/types/post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ post?: Post; error?: string }>
) {
  try {
    const client = await clientPromise;
    const db = client.db("football-blog");
    const postsCollection = db.collection("posts");

    // Վերցնում ենք միակ կամ առաջինը, որը published է, ըստ createdAt իջեցվող կարգով (հավասարապես կարող է լինել ըստ views)
    const topPost = await postsCollection.findOne(
      { published: true },
      { sort: { createdAt: -1 } }
    );

    if (!topPost) {
      return res.status(404).json({ error: "No top post found" });
    }

    const post: Post = {
      _id: topPost._id.toString(),
      title: topPost.title,
      slug: topPost.slug,
      content: topPost.content,
      coverImage: topPost.coverImage,
      author: topPost.author,
      createdAt:
        topPost.createdAt instanceof Date
          ? topPost.createdAt.toISOString()
          : topPost.createdAt,
      updatedAt:
        topPost.updatedAt instanceof Date
          ? topPost.updatedAt.toISOString()
          : topPost.updatedAt,
      tags: topPost.tags ?? [],
      published: topPost.published,
    };

    return res.status(200).json({ post });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
