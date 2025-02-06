"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handlerNav = (link: string) => {
    router.push(link);
  };

  return (
    <nav className="flex gap-3">
      <button onClick={() => handlerNav("/pop-quiz")}>Pop Quiz!</button>
      <button onClick={() => handlerNav("/storyteller")}>Storyteller</button>
    </nav>
  );
}
