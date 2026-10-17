import Container from "@/app/_components/container";
import { PAGE_SLOGAN } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <Container>
        <div className="border-t-2 border-neutral-950 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-neutral-950"
            >
              databistro<span className="text-[#1D4ED8]">.eu</span>
            </Link>
            <p className="text-sm text-neutral-500 mt-1">{PAGE_SLOGAN}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:databistro.oevk6@passmail.net"
              className="bg-neutral-950 hover:bg-[#1D4ED8] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-5 transition-colors"
            >
              Kontakt
            </a>
            <a
              href="https://github.com/emenems/databistro"
              className="font-mono text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-950 font-semibold px-3 py-2 border border-neutral-300 hover:border-neutral-950 transition-colors"
            >
              GitHub Source ↗
            </a>
          </div>
        </div>
        <div className="py-5 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <span>© {new Date().getFullYear()} databistro.eu</span>
          <div>
            Developed by{" "}
            <a
              href="https://citeme.eu"
              className="font-semibold text-neutral-700 hover:text-[#1D4ED8] transition-colors"
            >
              citeme.eu
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
