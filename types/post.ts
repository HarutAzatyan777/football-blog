// types/post.ts

export interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    author?: {
      name: string;
      avatar?: string;
      email?: string;
    };
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
    published?: boolean;
  }
  