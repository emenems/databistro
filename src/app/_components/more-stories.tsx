import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <h2 className="mb-8 text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-950">
        Viac príspevkov
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 mb-24">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            codeName={post.code?.name}
          />
        ))}
      </div>
    </section>
  );
}
