'use client';

import { useMemo, useState } from 'react';
import { API_CATALOG, API_TAGS, type ApiEndpoint } from '@/lib/api-catalog';
import { API_EXAMPLES } from '@/lib/api-examples';

interface ApiResponse {
  status: number;
  ms: number;
  body: unknown;
  url: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Tiny JSON syntax highlighter (keys / strings / numbers / booleans / null).
function highlightJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  return escapeHtml(json).replace(
    /(&quot;(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*&quot;(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = 'json-num';
      if (/^&quot;/.test(m)) cls = /:$/.test(m) ? 'json-key' : 'json-str';
      else if (/true|false/.test(m)) cls = 'json-bool';
      else if (/null/.test(m)) cls = 'json-null';
      return `<span class="${cls}">${m}</span>`;
    }
  );
}

function buildUrl(ep: ApiEndpoint, values: Record<string, string>): string {
  let path = ep.path;
  for (const p of ep.params) {
    if (p.in === 'path') path = path.replace(`{${p.name}}`, encodeURIComponent(values[p.name] ?? ''));
  }
  const qs = new URLSearchParams();
  for (const p of ep.params) {
    if (p.in === 'query') {
      const v = (values[p.name] ?? '').trim();
      if (v !== '') qs.append(p.name, v);
    }
  }
  const q = qs.toString();
  return q ? `${path}?${q}` : path;
}

function exampleValues(ep: ApiEndpoint, onlyRequired = true): Record<string, string> {
  const v: Record<string, string> = {};
  for (const p of ep.params) {
    if (!p.example && !p.default) continue;
    if (onlyRequired && !p.required && p.in !== 'path') continue;
    v[p.name] = p.example ?? p.default ?? '';
  }
  return v;
}

export default function ApiExplorer({ initialId }: { initialId?: string }) {
  const startId = API_CATALOG.some((e) => e.id === initialId) ? initialId! : API_CATALOG[0].id;
  const [selectedId, setSelectedId] = useState(startId);
  // Pre-fill required + path params so Send works immediately
  // (placeholders are hints, not values).
  const [values, setValues] = useState<Record<string, string>>(() =>
    exampleValues(API_CATALOG.find((e) => e.id === startId)!)
  );
  const [resp, setResp] = useState<ApiResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState('');

  const ep = useMemo(() => API_CATALOG.find((e) => e.id === selectedId)!, [selectedId]);
  const url = useMemo(() => buildUrl(ep, values), [ep, values]);

  function select(id: string) {
    const next = API_CATALOG.find((e) => e.id === id)!;
    setSelectedId(id);
    setValues(exampleValues(next));
    setResp(null);
    setCopied('');
  }

  function fillExamples() {
    setValues(exampleValues(ep, false));
  }

  async function send() {
    setSending(true);
    setResp(null);
    const t0 = performance.now();
    try {
      const r = await fetch(url);
      let body: unknown;
      try {
        body = await r.json();
      } catch {
        body = { raw: await r.text().catch(() => '') };
      }
      setResp({ status: r.status, ms: Math.round(performance.now() - t0), body, url });
    } catch (e) {
      setResp({ status: 0, ms: Math.round(performance.now() - t0), body: { error: e instanceof Error ? e.message : 'fetch failed' }, url });
    } finally {
      setSending(false);
    }
  }

  async function copy(text: string, which: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const curl = `curl "${url}"`;
  const ok = resp !== null && resp.status >= 200 && resp.status < 300;

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      {/* endpoint list */}
      <nav className="md-card md-card-outlined flex max-h-[70vh] flex-col gap-1 overflow-y-auto p-2">
        {API_TAGS.map((tag) => (
          <div key={tag}>
            <p className="md-label px-3 pb-1 pt-2" style={{ color: 'var(--md-primary)' }}>
              {tag}
            </p>
            {API_CATALOG.filter((e) => e.tag === tag).map((e) => (
              <button
                key={e.id}
                onClick={() => select(e.id)}
                className="md-explorer-item"
                data-active={e.id === selectedId}
              >
                <span className="md-method">{e.method}</span>
                <span className="truncate">{e.summary}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* request builder + response */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="md-card md-card-outlined p-4 sm:p-5">
          <p className="md-label" style={{ color: 'var(--md-primary)' }}>
            Request
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="md-method lg">{ep.method}</span>
            <code className="md-code min-w-0 flex-1 break-all">{url || ep.path}</code>
            <button onClick={() => copy(url || ep.path, 'url')} className="md-btn md-btn-text">
              {copied === 'url' ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
          <p className="md-body mt-2" style={{ color: 'var(--md-on-surface-variant)' }}>
            {ep.description}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ep.params.map((p) => (
              <label key={p.name} className="flex min-w-0 flex-col gap-1">
                <span className="md-label">
                  {p.name}
                  {p.required ? <span style={{ color: 'var(--md-error)' }}> *</span> : null}
                  <span className="md-caption"> · {p.in} · {p.type}</span>
                </span>
                {p.type === 'enum' && p.options ? (
                  <select
                    className="md-input"
                    value={values[p.name] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
                  >
                    <option value="">(default{p.default ? `: ${p.default}` : ''})</option>
                    {p.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="md-input"
                    type={p.type === 'number' ? 'number' : 'text'}
                    placeholder={p.example ?? (p.default ? `default: ${p.default}` : '')}
                    value={values[p.name] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
                  />
                )}
                <span className="md-caption">{p.description}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={send} disabled={sending} className="md-btn md-btn-filled">
              {sending ? 'Sending…' : '▶ Send request'}
            </button>
            <button onClick={fillExamples} className="md-btn md-btn-tonal">
              Fill examples
            </button>
            <button
              onClick={() => {
                setValues({});
                setResp(null);
              }}
              className="md-btn md-btn-outlined"
            >
              Clear
            </button>
            <button onClick={() => copy(curl, 'curl')} className="md-btn md-btn-text">
              {copied === 'curl' ? 'Copied!' : 'Copy as cURL'}
            </button>
          </div>
        </div>

        <div className="md-card md-card-outlined p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="md-label" style={{ color: 'var(--md-primary)' }}>
              {resp ? 'Live response' : 'Response structure'}
            </p>
            <span className="flex-1" />
            {resp ? (
              <>
                <span className="md-status" data-ok={ok}>
                  {resp.status === 0 ? 'NETWORK ERROR' : resp.status}
                </span>
                <span className="md-caption">{resp.ms} ms</span>
              </>
            ) : (
              <span className="md-caption">example — hit Send for live data</span>
            )}
            <button
              onClick={() =>
                copy(JSON.stringify(resp ? resp.body : (API_EXAMPLES[ep.id] ?? {}), null, 2), 'body')
              }
              className="md-btn md-btn-text"
            >
              {copied === 'body' ? 'Copied!' : resp ? 'Copy response' : 'Copy structure'}
            </button>
          </div>
          <pre
            className="md-json mt-3 overflow-x-auto p-3"
            dangerouslySetInnerHTML={{ __html: highlightJson(resp ? resp.body : (API_EXAMPLES[ep.id] ?? {})) }}
          />
        </div>
      </div>
    </div>
  );
}
