import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  titleKey: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  code: {
    name: string;
    source: string;
  };
  content: string;
  preview?: boolean;
};
