import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  date: string;
  author: Author;
  excerpt: string;
};

export function PostHeader({ title, excerpt, date, author }: Props) {
  return (
    <div className="border-b border-neutral-200 pb-8 mb-10">
      <div className="mb-3">
        <DateFormatter dateString={date} />
      </div>
      <PostTitle>{title}</PostTitle>
      <div className="mt-5">
        <Avatar name={author.name} picture={author.picture} excerpt={excerpt} />
      </div>
    </div>
  );
}
