import { useContext } from "react";
import { SeoSsrContext } from "../../lib/seoContext";
import { OG_IMAGE, SITE_NAME } from "../../config/site";
import { absUrl } from "../../lib/seo";

// React 19 নিজেই <title>/<meta>/<link> ট্যাগ <head>-এ তুলে দেয়, আলাদা লাইব্রেরি লাগে না।
// seo অবজেক্ট বানানো হয় src/lib/seo.js এ।
const Seo = ({ seo }) => {
  const isSsr = useContext(SeoSsrContext);
  if (isSsr || !seo) return null;

  const url = !seo.noindex && seo.path ? absUrl(seo.path) : null;

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta
        name="robots"
        content={
          seo.noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large"
        }
      />
      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={seo.type || "website"} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {(seo.jsonLd || []).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ld).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
};

export default Seo;
