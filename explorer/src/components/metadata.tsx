const SITE_TITLE = 'DreamCon';

const SITE_DESCRIPTION =
  'พื้นที่รวบรวมบทสนทนาเกี่ยวกับ “รัฐธรรมนูญในฝัน” จากผู้คนหลากหลาย เพื่อเป็นฐานข้อมูลส่งต่อให้ผู้เกี่ยวข้อง นำเสียงของประชาชนไปใช้อย่างมีความหมาย';

const SITE_URL = `${import.meta.env.VITE_SITE_ORIGIN || 'http://localhost:3000'}${import.meta.env.BASE_URL}`;

const OG_IMAGE_URL = `${SITE_URL}og.png`;

const NO_INDEX = import.meta.env.VITE_NO_INDEX === 'true';

export function Metadata({
  title,
  noIndex = false,
}: {
  title?: string;
  noIndex?: boolean;
}) {
  const fullTitle = title ? `${title} - ${SITE_TITLE}` : SITE_TITLE;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={SITE_DESCRIPTION} />
      {(NO_INDEX || noIndex) && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <link
        rel="icon"
        type="image/png"
        href={`${import.meta.env.BASE_URL}favicon.png`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={SITE_DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />
    </>
  );
}
