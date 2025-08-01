
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
import DemographyCharts from "../../_components/demography/page";
import TelcoSKCharts from "../../_components/telcosk/page";
import AirQualitySKCharts from "../../_components/airqualitysk/page";
import RentCalc from "../../_components/rentcalc/page";
import OlympicSports from "../../_components/olympics/page";
import Trashboard from "../../_components/trashboard/page";
import Parliament from "../../_components/parliament/page";
import GiniCalc from "../../_components/ginicalc/page";
import Elektromobilita from "../../_components/elektromobilita/page";
import Krimianalytika from "../../_components/krimianalytika/page";
import TradeSK from "../../_components/tradesk/page";
import AlcoTax from "../../_components/alcotax/page";
import Ustava from "../../_components/ustava/page";

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
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
        {post.code.name === "DemographyCharts" && <DemographyCharts />}
        {post.code.name === "TelcoSKCharts" && <TelcoSKCharts />}
        {post.code.name === "AirQualitySKCharts" && <AirQualitySKCharts />}
        {post.code.name === "RentCalc" && <RentCalc />}
        {post.code.name === "OlympicSports" && <OlympicSports />}
        {post.code.name === "Trashboard" && <Trashboard />}
        {post.code.name === "Parliament" && <Parliament />}
        {post.code.name === "GiniCalc" && <GiniCalc />}
        {post.code.name === "Elektromobilita" && <Elektromobilita />}
        {post.code.name === "Krimianalytika" && <Krimianalytika />}
        {post.code.name === "TradeSK" && <TradeSK />}
        {post.code.name === "AlcoTax" && <AlcoTax />}
        {post.code.name === "Ustava" && <Ustava />}
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
