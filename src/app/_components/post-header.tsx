import Avatar from "./avatar";
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
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} excerpt={excerpt}/>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture}  excerpt={excerpt}/>
        </div>
        {/* <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div> */}
      </div>
    </>
  );
}
