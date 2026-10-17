import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.06] text-neutral-950">
      {children}
    </h1>
  );
}
