import type { JSXConverters } from '@payloadcms/richtext-lexical/react';
import type { SerializedLexicalNode } from 'lexical';

import { parseEmbedVideoUrl, parseSocialUrl, SOCIAL_PROVIDER_LABELS } from '@/cms/blocks/embed-url';
import type {
  CalloutBlock,
  CtaBlock,
  GalleryBlock,
  QuoteBlock,
  RelatedNewsBlock,
  SocialEmbedBlock,
  VideoEmbedBlock,
} from '@/cms/payload-types';
import { format, type Locale } from '@site/i18n';

import { Gallery } from './Gallery';
import { posterUrl, ratioToCss, safeHref, toRichImage, toRichVideoFile } from './media';
import { RichFigure } from './RichFigure';
import { RichVideo, type RichVideoProps } from './RichVideo';
import s from './rich-blocks.module.css';
import { SocialEmbed } from './SocialEmbed';
import { richBlockStrings, type RichBlockStrings } from './strings';
import { Callout, CtaButton, PullQuote, RelatedInline } from './TextBlocks';

/**
 * Lexical -> JSX converters for every newsroom editor block and the inline
 * image. Registered (spread last, so they win) by ArticleBody:
 *
 *   const rich = richBlockConverters(locale);
 *   { ...defaultConverters, ..., ...rich.nodes, blocks: { ..., ...rich.blocks } }
 *
 * Block slugs are the stored `blockType`s - never rename them:
 * gallery, videoEmbed (old link-only nodes have no `source` -> treated as link),
 * socialEmbed, callout, quote, cta, relatedNews. `code` stays in ArticleBody.
 */

type BlockConverters = NonNullable<JSXConverters['blocks']>;
type UploadConverter = NonNullable<JSXConverters['upload']>;

const VIDEO_PROVIDERS = { youtube: 'YouTube', vimeo: 'Vimeo', facebook: 'Facebook', tiktok: 'TikTok' } as const;

const fieldsOf = <T,>(node: unknown): Partial<T> => ((node as { fields?: T }).fields ?? {}) as Partial<T>;

function shapeOf(aspect: string): RichVideoProps['shape'] {
  const [w, h] = aspect.split('/').map((n) => Number(n.trim()));
  if (!w || !h) return 'landscape';
  if (h > w * 1.05) return 'portrait';
  if (Math.abs(w - h) <= w * 0.05) return 'square';
  return 'landscape';
}

function mimeFromUrl(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return ext === 'webm' ? 'video/webm' : ext === 'ogg' || ext === 'ogv' ? 'video/ogg' : 'video/mp4';
}

function credited(t: RichBlockStrings, caption: string | null | undefined, credit: string | null | undefined, tpl: string) {
  const c = caption?.trim();
  const by = credit?.trim();
  if (!c && !by) return null;
  return (
    <>
      {c ? <span>{c}</span> : null}
      {by ? <span className={s.credit}>{format(tpl, { credit: by })}</span> : null}
    </>
  );
}

function renderVideo(f: Partial<VideoEmbedBlock>, t: RichBlockStrings) {
  const fixed = f.aspectRatio && f.aspectRatio !== 'auto' ? ratioToCss(f.aspectRatio) : null;
  const blockPoster = posterUrl(f.poster);

  if (f.source === 'upload') {
    const file = toRichVideoFile(f.file);
    if (!file) return null;
    const aspect = fixed ?? (file.width && file.height ? `${file.width} / ${file.height}` : '16 / 9');
    const title = f.title?.trim() || file.title || t.videoFallbackTitle;
    return (
      <RichVideo
        source={{ kind: 'file', src: file.src, mimeType: file.mimeType, autoplay: Boolean(f.autoplay) }}
        aspect={aspect}
        shape={shapeOf(aspect)}
        poster={blockPoster ?? posterUrl(file.poster)}
        title={title}
        playLabel={format(t.playVideo, { title })}
        caption={credited(t, f.caption || file.caption, f.credit || file.credit, t.videoCredit)}
      />
    );
  }

  // source "url" (or legacy nodes without `source`)
  const video = parseEmbedVideoUrl(f.url);
  if (!video) return null;
  const aspect = fixed ?? (video.vertical ? '9 / 16' : '16 / 9');
  const title = f.title?.trim() || f.caption?.trim() || t.videoFallbackTitle;
  const caption = credited(t, f.caption, f.credit, t.videoCredit);
  if (video.provider === 'file') {
    return (
      <RichVideo
        source={{ kind: 'file', src: video.embedUrl, mimeType: mimeFromUrl(video.embedUrl), autoplay: Boolean(f.autoplay) }}
        aspect={aspect}
        shape={shapeOf(aspect)}
        poster={blockPoster}
        title={title}
        playLabel={format(t.playVideo, { title })}
        caption={caption}
      />
    );
  }
  const provider = VIDEO_PROVIDERS[video.provider];
  return (
    <RichVideo
      source={{ kind: 'embed', provider: video.provider, embedUrl: video.embedUrl }}
      aspect={aspect}
      shape={shapeOf(aspect)}
      poster={blockPoster ?? video.thumbnailUrl}
      title={title}
      playLabel={format(t.playVideo, { title })}
      providerLabel={provider}
      notice={format(t.embedNotice, { provider })}
      caption={caption}
    />
  );
}

export function richBlockConverters(locale: Locale): { nodes: Pick<JSXConverters, 'upload'>; blocks: BlockConverters } {
  const t = richBlockStrings(locale);

  const upload: UploadConverter = ({ node }) => {
    const n = node as unknown as {
      value?: unknown;
      fields?: { caption?: string | null; size?: string | null; align?: string | null } | null;
    };
    const mime = (n.value as { mimeType?: string | null } | undefined)?.mimeType ?? 'image/';
    if (!mime.startsWith('image/')) {
      // Non-image upload (should not happen: the node only accepts the image library) -> plain link.
      const doc = n.value as { url?: string; filename?: string } | undefined;
      const url = safeHref(doc?.url);
      return url ? (
        <p>
          <a href={url} rel="noopener">
            {doc?.filename ?? url}
          </a>
        </p>
      ) : null;
    }
    return <RichFigure value={n.value} caption={n.fields?.caption} size={n.fields?.size} align={n.fields?.align} t={t} />;
  };

  const blocks: BlockConverters = {
    videoEmbed: ({ node }) => renderVideo(fieldsOf<VideoEmbedBlock>(node), t),

    gallery: ({ node }) => {
      const f = fieldsOf<GalleryBlock>(node);
      const images = (f.images ?? []).map(toRichImage).filter((x): x is NonNullable<typeof x> => x !== null);
      if (!images.length) return null;
      if (images.length === 1) {
        return <RichFigure value={(f.images ?? []).find((m) => toRichImage(m))} caption={f.caption} t={t} />;
      }
      const cols = Number(f.columns ?? 3);
      return (
        <Gallery
          images={images}
          layout={f.layout === 'slider' ? 'slider' : 'grid'}
          columns={cols === 2 || cols === 4 ? cols : 3}
          ratio={f.ratio && f.ratio !== 'auto' ? ratioToCss(f.ratio) : null}
          showCaptions={f.showCaptions !== false}
          caption={f.caption?.trim() || null}
          labels={{
            label: t.galleryLabel,
            open: t.galleryOpen,
            prev: t.galleryPrev,
            next: t.galleryNext,
            close: t.galleryClose,
            counter: t.galleryCounter,
            credit: t.photoCredit,
          }}
        />
      );
    },

    socialEmbed: ({ node }) => {
      const f = fieldsOf<SocialEmbedBlock>(node);
      const parsed = parseSocialUrl(f.url);
      if (!parsed) {
        const url = safeHref(f.url);
        return url ? (
          <p>
            <a href={url} target="_blank" rel="noopener noreferrer nofollow">
              {url}
            </a>
          </p>
        ) : null;
      }
      const provider = SOCIAL_PROVIDER_LABELS[parsed.provider];
      return (
        <SocialEmbed
          provider={parsed.provider}
          providerLabel={provider}
          url={parsed.url}
          embedUrl={parsed.embedUrl}
          isVideo={Boolean(parsed.embedUrl?.includes('/plugins/video.php'))}
          caption={f.caption?.trim() || null}
          labels={{
            postOn: format(t.socialPostOn, { provider }),
            load: t.socialLoad,
            open: format(t.socialOpen, { provider }),
            notice: format(t.socialNotice, { provider }),
            newTab: t.opensNewTab,
          }}
        />
      );
    },

    callout: ({ node, nodesToJSX }) => {
      const f = fieldsOf<CalloutBlock>(node);
      const children = (f.content?.root?.children ?? []) as unknown as SerializedLexicalNode[];
      const body = children.length ? nodesToJSX({ nodes: children }) : [];
      if (!body.length && !f.title?.trim()) return null;
      return (
        <Callout variant={f.variant} title={f.title} t={t}>
          {body}
        </Callout>
      );
    },

    quote: ({ node }) => {
      const f = fieldsOf<QuoteBlock>(node);
      return <PullQuote text={f.text} author={f.author} role={f.role} sourceUrl={f.sourceUrl} t={t} />;
    },

    cta: ({ node }) => {
      const f = fieldsOf<CtaBlock>(node);
      return (
        <CtaButton label={f.label} url={f.url} note={f.note} variant={f.variant} newTab={f.newTab} nofollow={f.nofollow} t={t} />
      );
    },

    relatedNews: ({ node }) => {
      const f = fieldsOf<RelatedNewsBlock>(node);
      return <RelatedInline title={f.title} posts={f.posts} locale={locale} t={t} />;
    },
  };

  return { nodes: { upload }, blocks };
}
