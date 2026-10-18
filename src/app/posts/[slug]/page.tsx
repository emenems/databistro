
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";
import { PAGE_NAME, SITE_URL } from "../../../lib/constants";
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
import Dochodkovo from "../../_components/dochodkovo/page";
import WorldCup2026Sim from "../../_components/worldcup2026/page";
import Preferencie from "../../_components/preferencie/page";


export default async function Post({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle ?? post.title,
    description: post.description ?? post.excerpt,
    image: `${SITE_URL}${post.ogImage.url}`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "sk",
    mainEntityOfPage: `${SITE_URL}/posts/${post.slug}`,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: PAGE_NAME, url: SITE_URL },
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
        {post.code.name === "Dochodkovo" && <Dochodkovo />}
        {post.code.name === "WorldCup2026Sim" && <WorldCup2026Sim />}
        {post.code.name === "Preferencie" && <Preferencie />}
        <div className="mt-32">
          <PostBody content={content} />
        </div>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const title = post.seoTitle ?? post.title;
  const description = post.description ?? post.excerpt;
  const url = `/posts/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: PAGE_NAME,
      locale: "sk_SK",
      title: `${title} | ${PAGE_NAME}`,
      description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [post.ogImage.url],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${PAGE_NAME}`,
      description,
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
