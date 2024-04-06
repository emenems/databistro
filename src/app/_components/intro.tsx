import { PAGE_NAME, PAGE_SLOGAN } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        {PAGE_NAME}
      </h2>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        {PAGE_SLOGAN}
      </h4>
    </section>
  );
}
