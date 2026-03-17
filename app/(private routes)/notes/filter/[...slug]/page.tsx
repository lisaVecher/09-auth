import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? "all";

  const title = `Notes filtered by ${currentTag} | NoteHub`;
  const description = `Browse notes filtered by the "${currentTag}" tag in the NoteHub application.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `09-auth-chi-flax.vercel.app/notes/filter/${currentTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub preview",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
  searchParams,
}: NotesFilterPageProps) {
  const { slug = [] } = await params;
  const query = await searchParams;

  const currentTag = slug[0] ?? "all";
  const page = Number(query.page) || 1;
  const search = query.search || "";

  const tag = currentTag === "all" ? undefined : (currentTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes({
  page,
  search,
  tag,
}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={search} tag={tag} />
    </HydrationBoundary>
  );
}
