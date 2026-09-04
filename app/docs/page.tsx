import { redirect } from 'next/navigation';

// /docs moved to /playground — keep old links working.
export default async function DocsPage({
  searchParams
}: {
  searchParams: Promise<{ endpoint?: string }>;
}) {
  const { endpoint } = await searchParams;
  redirect(endpoint ? `/playground?endpoint=${encodeURIComponent(endpoint)}` : '/playground');
}
