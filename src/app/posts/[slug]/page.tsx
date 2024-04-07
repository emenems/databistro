
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import { CMS_NAME } from "../../../lib/constants";
import markdownToHtml from "../../../lib/markdownToHtml";
import Alert from "../../_components/alert";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";
import { DemographySummaryCards } from "@/app/_components/demography/demography-summary";
import { DemographySummaryAgeCards } from "@/app/_components/demography/demography-series";
import { getDemographySeries, getDemographyAgeSeries } from "@/lib/api";

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const data = await getDemographySeries("all","all","eu");
  const dataAge = await getDemographyAgeSeries("all","all","ce","all");
  const dataAgeMedian = await getDemographyAgeSeries("all","all","ce","median");
  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-6">
          <PostHeader
            title={post.titleKey}
            excerpt={post.excerpt}
            date={post.date}
            author={post.author}
          />
        </article>
        <div className="container flex flex-row items-center">
            <DemographySummaryCards data={data}/>
        </div>
        <div className="container flex flex-row items-center mt-8">
            <DemographySummaryAgeCards dataAge={dataAge} dataAgeMedian={dataAgeMedian}/>
        </div>
        <div className="mt-32">
          <PostBody content={content} />
        </div>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | databistro blog post ${CMS_NAME}`;

  return {
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
