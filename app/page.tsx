import { notFound } from "next/navigation";

// The Worker serves the homepage directly. Keep a root app route so Vinext
// can render the branded not-found page for paths without a matching route.
export default function Home() {
  notFound();
}
