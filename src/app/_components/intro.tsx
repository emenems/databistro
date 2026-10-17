import { PAGE_SLOGAN } from "@/lib/constants";
import Link from "next/link";

export function Intro() {
  return (
    <header className="border-b-2 border-neutral-950 pb-5 pt-8 md:pt-12 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <Link
        href="/"
        className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-950 hover:opacity-80 transition-opacity"
      >
        databistro<span className="text-[#1D4ED8]">.eu</span>
      </Link>
      <p className="text-sm text-neutral-500 font-medium">{PAGE_SLOGAN}</p>
    </header>
  );
}
