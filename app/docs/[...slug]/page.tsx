import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { resolvePublicOrigin } from "../../public-origin";
import DocPage from "../_components/DocPage";
import { docPageBySlug, docPages } from "../content";

type RouteProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const page = docPageBySlug.get((await params).slug.join("/"));
  if (!page) return {};

  return {
    title: `${page.title} — Red documentation`,
    description: page.description,
    alternates: { canonical: page.href },
  };
}

export default async function DocumentationPage({ params }: RouteProps) {
  const page = docPageBySlug.get((await params).slug.join("/"));
  if (!page) notFound();

  const origin = resolvePublicOrigin(await headers());
  return <DocPage page={page} body={page.render({ origin })} />;
}
