import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/lib/ui-types';

export function GridCard({
  href,
  title,
  subtitle,
  image
}: {
  href: string;
  title: string;
  subtitle?: string;
  image?: { image?: { quality: string; url: string }[] };
}) {
  const src = image ? img(image) : '';
  return (
    <Link href={href} className="md-card md-card-filled md-card-hover block p-3">
      {src ? (
        <Image
          src={src}
          alt={title}
          width={300}
          height={300}
          className="aspect-square w-full object-cover"
          style={{ borderRadius: 12 }}
        />
      ) : (
        <div
          className="aspect-square w-full"
          style={{ borderRadius: 12, background: 'var(--md-surface-container-high)' }}
        />
      )}
      <p className="md-label mt-2 truncate">{title}</p>
      {subtitle ? <p className="md-caption truncate">{subtitle}</p> : null}
    </Link>
  );
}
