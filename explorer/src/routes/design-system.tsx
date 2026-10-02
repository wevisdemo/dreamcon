import { createFileRoute } from '@tanstack/react-router';

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

export const Route = createFileRoute('/design-system')({
  head: () => ({
    meta: [
      { title: 'Design system | Dream Constitution' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: function DesignSystem() {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-12 p-8">
        <h1 className="text-h3 font-bold">Design system</h1>

        <section className="flex flex-col gap-6">
          <h2 className="text-h5 font-bold">Colors</h2>
          {palettes.map(({ name, shades }) => (
            <div key={name} className="flex flex-col gap-2">
              <h3 className="text-h8 font-bold capitalize">{name}</h3>
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
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-h5 font-bold">Typography</h2>
          <p className="text-b5 text-gray-7">
            Sizes are mobile/desktop, switching at <code>md</code>. Weight is
            set separately with <code>font-bold</code>.
          </p>
          <h3 className="mt-4 text-h8 font-bold">
            Heading · IBM Plex Sans Thai
          </h3>
          <TypeScale styles={headings} />
          <h3 className="mt-4 text-h8 font-bold">
            Body · IBM Plex Sans Thai Looped (default)
          </h3>
          <TypeScale styles={bodies} />
        </section>
      </main>
    );
  },
});
