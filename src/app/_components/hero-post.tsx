import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";
import { HeroSimulatorPreview } from "./hero-simulator-preview";
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

export function HeroPost({
  title,
  date,
  excerpt,
  slug,
  codeName,
}: Props) {
  const isWorldCup =
    codeName === "WorldCup2026Sim" || slug === "fifa-world-cup-2026";

  const cta = isWorldCup
    ? { label: "Otvoriť simuláciu", hint: "Interaktívne: nastavte počet simulácií a pravdepodobnosť remízy" }
    : codeName === "Preferencie"
      ? { label: "Otvoriť odpočet a grafy", hint: "Interaktívne: odpočet do ďalších volieb a porovnanie prieskumov s výsledkami" }
      : { label: "Otvoriť príspevok", hint: "Interaktívne grafy a dáta" };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-14 mb-12 border-b border-neutral-200">
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div>
          <div className="mb-3">
            <DateFormatter dateString={date} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold tracking-tight leading-[1.08] text-neutral-950 mb-5">
            <Link
              href={`/posts/${slug}`}
              className="hover:text-[#1D4ED8] transition-colors"
            >
              {title}
            </Link>
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed mb-7">
            {excerpt}
          </p>
        </div>

        <div>
          <Link
            href={`/posts/${slug}`}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-blue-800 text-white font-semibold text-sm px-5 py-3 transition-colors"
          >
            <span>{cta.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-xs text-neutral-500 mt-3">
            {cta.hint}
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 w-full">
        {isWorldCup ? (
          <HeroSimulatorPreview />
        ) : (
          <Link href={`/posts/${slug}`} className="block group">
            <PostSpecimen slug={slug} codeName={codeName} />
          </Link>
        )}
      </div>
    </section>
  );
}
