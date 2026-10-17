import { PAGE_SLOGAN } from "@/lib/constants";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b-2 border-neutral-950 pb-5 pt-8 md:pt-12 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <Link
        href="/"
        className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-950 hover:opacity-80 transition-opacity"
      >
        databistro<span className="text-[#1D4ED8]">.eu</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm text-neutral-500 font-medium">
          {PAGE_SLOGAN}
        </span>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-[#1D4ED8] hover:underline font-semibold"
        >
          ← Všetky príspevky
        </Link>
      </div>
    </header>
  );
};

export default Header;
