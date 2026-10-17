import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";
import { PostSpecimen } from "./post-specimen";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
  codeName?: string;
};

export function PostPreview({
  title,
  date,
  excerpt,
  slug,
  codeName,
}: Props) {
  return (
    <article className="border-t-2 border-neutral-950 pt-5 group flex flex-col justify-between">
      <div>
        <Link
          href={`/posts/${slug}`}
          aria-label={title}
          className="block mb-4"
        >
          <PostSpecimen slug={slug} codeName={codeName} />
        </Link>
        <div className="mb-2">
          <DateFormatter dateString={date} />
        </div>
        <h3 className="text-xl font-bold tracking-tight leading-snug text-neutral-950 mb-2.5">
          <Link
            href={`/posts/${slug}`}
            className="group-hover:text-[#1D4ED8] transition-colors"
          >
            {title}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">{excerpt}</p>
      </div>
    </article>
  );
}
