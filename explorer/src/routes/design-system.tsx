import { useState, type ReactNode } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/button';
import { CommentDot } from '../components/comment-dot';
import { CommentTag } from '../components/comment-tag';
import { Dropdown } from '../components/dropdown';
import { FilterTag } from '../components/filter-tag';
import { SearchBar } from '../components/search-bar';
import { Tabs } from '../components/tabs';
import { commentViews } from '../constants/comment-views';
import { CloseIcon } from '../icons/close';

const palettes = [
  {
    name: 'gray',
    shades: [
      'white',
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(n => `gray-${n}`),
      'black',
    ],
  },
  ...['blue', 'green', 'red', 'yellow'].map(name => ({
    name,
    shades: Array.from({ length: 10 }, (_, i) => `${name}-${i + 1}`),
  })),
];

const headings = [
  { className: 'text-h2', spec: '48/72px · 125%' },
  { className: 'text-h3', spec: '36/60px · 125%' },
  { className: 'text-h4', spec: '32/48px · 140%' },
  { className: 'text-h5', spec: '28/36px · 140%' },
  { className: 'text-h6', spec: '24/32px · 140%' },
  { className: 'text-h7', spec: '21/28px · 140%' },
  { className: 'text-h8', spec: '18/24px · 140%' },
  { className: 'text-h9', spec: '16/21px · 140%' },
  { className: 'text-h10', spec: '14/18px · 140%' },
];

const bodies = [
  { className: 'text-b4', spec: '16/18px · 150%' },
  { className: 'text-b5', spec: '14/16px · 150%' },
  { className: 'text-b6', spec: '12/14px · 150%' },
  { className: 'text-b7', spec: '10/12px · 150%' },
];

const sample = 'รัฐธรรมนูญในฝัน Dream Constitution';

const buttonRows = [
  {
    background: 'bg-white',
    variants: [
      'primary-blue',
      'primary-gray',
      'secondary',
      'tertiary-blue',
      'tertiary-gray',
      'icon-blue',
    ],
  },
  {
    background: 'bg-blue-7 text-white',
    variants: ['primary-white', 'tertiary-white', 'icon-white'],
  },
] as const;

function TypeScale({
  styles,
}: {
  styles: { className: string; spec: string }[];
}) {
  return (
    <ul className="divide-y divide-gray-3">
      {styles.map(({ className, spec }) => (
        <li
          key={className}
          className="grid gap-2 py-4 md:grid-cols-[10rem_1fr] md:items-baseline"
        >
          <div className="text-b6 text-gray-7">
            <code className="font-bold text-black">{className}</code>
            <div>{spec}</div>
          </div>
          <div className={className}>
            <p className="font-bold">{sample}</p>
            <p>{sample}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-6 [&::-webkit-details-marker]:hidden">
        <h2 className="text-h5 font-bold">{title}</h2>
        <CloseIcon className="size-8 rotate-45 transition-transform group-open:rotate-0" />
      </summary>
      <div className="flex flex-col gap-8 pb-8">{children}</div>
    </details>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-h8 font-bold first-letter:uppercase">{title}</h3>
      {children}
    </div>
  );
}

function Showcase({
  caption,
  className = '',
  children,
}: {
  caption?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {caption && <code className="text-b6 text-gray-7">{caption}</code>}
      <div
        className={`flex flex-wrap items-end gap-8 rounded-lg border border-gray-3 p-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <code className="text-b7">{label}</code>
    </div>
  );
}

function TabsDemo() {
  const [tab, setTab] = useState('category');

  return (
    <div className="max-w-sm">
      <Tabs
        tabs={[
          { value: 'category', label: 'หมวดหมู่' },
          { value: 'event', label: 'วงสนทนา' },
        ]}
        value={tab}
        onChange={setTab}
      />
    </div>
  );
}

export const Route = createFileRoute('/design-system')({
  head: () => ({
    meta: [
      { title: 'Design system | Dream Constitution' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: function DesignSystem() {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8">
        <h1 className="text-h3 font-bold">Design system</h1>

        <div className="divide-y divide-gray-3 border-y border-gray-3">
          <Section title="Colors">
            {palettes.map(({ name, shades }) => (
              <Subsection key={name} title={name}>
                <ul className="grid grid-cols-5 gap-2 md:grid-cols-10">
                  {shades.map(shade => (
                    <li key={shade} className="flex flex-col gap-1">
                      <div
                        className="aspect-square rounded-lg border border-gray-3"
                        style={{ background: `var(--color-${shade})` }}
                      />
                      <code className="text-b7">{shade}</code>
                    </li>
                  ))}
                </ul>
              </Subsection>
            ))}
          </Section>

          <Section title="Typography">
            <p className="text-b5 text-gray-7">
              Sizes are mobile/desktop, switching at <code>md</code>. Weight is
              set separately with <code>font-bold</code>.
            </p>
            <Subsection title="Heading · IBM Plex Sans Thai">
              <TypeScale styles={headings} />
            </Subsection>
            <Subsection title="Body · IBM Plex Sans Thai Looped (default)">
              <TypeScale styles={bodies} />
            </Subsection>
          </Section>

          <Section title="Components">
            <Subsection title="Button">
              {buttonRows.map(({ background, variants }) =>
                (['large', 'small'] as const).map(size => (
                  <Showcase
                    key={`${background}-${size}`}
                    caption={`size="${size}"`}
                    className={background}
                  >
                    {variants.map(variant => {
                      const isIcon = variant.startsWith('icon');
                      return (
                        <Specimen key={variant} label={variant}>
                          <Button
                            variant={variant}
                            size={size}
                            icon={<CloseIcon />}
                            aria-label={isIcon ? 'ปิด' : undefined}
                          >
                            {!isIcon && 'ปุ่ม'}
                          </Button>
                        </Specimen>
                      );
                    })}
                  </Showcase>
                ))
              )}
            </Subsection>
            <Subsection title="Tabs">
              <TabsDemo />
            </Subsection>
            <Subsection title="Filter tag">
              <Showcase>
                {(['primary', 'secondary'] as const).map(variant =>
                  (['large', 'medium', 'small'] as const).map(size => (
                    <Specimen
                      key={`${variant}-${size}`}
                      label={`${variant} · ${size}`}
                    >
                      <FilterTag variant={variant} size={size}>
                        ตัวกรอง
                      </FilterTag>
                    </Specimen>
                  ))
                )}
              </Showcase>
            </Subsection>
            <Subsection title="Comment tag">
              {(['medium', 'small'] as const).map(size => (
                <Showcase key={size} caption={`size="${size}"`}>
                  {[false, true].map(selected =>
                    commentViews.map(view => (
                      <Specimen
                        key={`${view}-${selected}`}
                        label={selected ? 'selected' : 'default'}
                      >
                        <CommentTag
                          view={view}
                          count={20}
                          size={size}
                          selected={selected}
                        />
                      </Specimen>
                    ))
                  )}
                </Showcase>
              ))}
            </Subsection>
            <Subsection title="Comment dot">
              <Showcase>
                {[false, true].map(extended =>
                  [...commentViews, undefined].map(view => (
                    <Specimen
                      key={`${view}-${extended}`}
                      label={`${view ?? 'no view'}${extended ? ' · extended' : ''}`}
                    >
                      <CommentDot view={view} extended={extended} />
                    </Specimen>
                  ))
                )}
              </Showcase>
            </Subsection>
            <Subsection title="Search bar">
              <Showcase className="bg-blue-1">
                <SearchBar onSearch={() => {}} className="w-64" />
              </Showcase>
            </Subsection>
            <Subsection title="Dropdown">
              <Showcase className="bg-gray-1">
                <Dropdown
                  aria-label="เรียงตาม"
                  options={[
                    { value: 'latest', label: 'ล่าสุด' },
                    { value: 'most-comments', label: 'ความคิดเห็นมากที่สุด' },
                    { value: 'most-agree', label: 'เห็นด้วยมากที่สุด' },
                  ]}
                />
              </Showcase>
            </Subsection>
          </Section>
        </div>
      </div>
    );
  },
});
