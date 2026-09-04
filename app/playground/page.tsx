import ApiExplorer from '@/components/api-explorer';

export default async function PlaygroundPage({
  searchParams
}: {
  searchParams: Promise<{ endpoint?: string }>;
}) {
  const { endpoint } = await searchParams;

  return (
    <div>
      <h1 className="md-display">Playground</h1>
      <p className="md-body mt-2" style={{ color: 'var(--md-on-surface-variant)' }}>
        Pick an endpoint, fill the parameters and hit <strong>Send request</strong> — every
        call runs live against this server. All endpoints return{' '}
        <code className="md-code-inline">{'{ success: true, data }'}</code> and are open for
        cross-origin calls, so agents and LLM tools can fetch them directly too.
      </p>
      <div className="mt-5">
        <ApiExplorer initialId={endpoint} />
      </div>
    </div>
  );
}
