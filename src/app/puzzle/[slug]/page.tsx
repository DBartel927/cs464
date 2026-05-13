import Home from '@/app/page';

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <Home forcedSlug={slug} />;
}