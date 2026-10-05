import Link from 'next/link';
import type { Payload, Where } from 'payload';
import { formatAdminURL } from 'payload/shared';

import { canPublish } from '../../access';

/**
 * Newsroom desk on top of /admin (`admin.components.beforeDashboard`).
 * Server component, one round of parallel Local API queries (all small:
 * `limit` <= 6, `depth: 0`, `select` title/updatedAt only), with the
 * signed-in user's access applied (`overrideAccess: false`) except for the
 * internal payload-jobs table.
 *
 * Shows: "Viết bài mới", counters (Bài nháp của tôi, Chờ duyệt, Đã hẹn giờ,
 * Đăng hôm nay, Liên hệ mới) and three short lists (my latest drafts, review
 * queue, upcoming scheduled publishes).
 */

type User = { id: number | string; name?: string | null; roles?: string[] | null };
type Props = { payload: Payload; user?: User | null; i18n?: { language?: string } };
type Row = { id: number | string; title?: string | null; updatedAt?: string; reviewStatus?: string | null };

const TZ = 'Asia/Ho_Chi_Minh';

/** Midnight today in Vietnam time, as ISO. */
function startOfTodayVN(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return new Date(`${parts}T00:00:00+07:00`).toISOString();
}

export async function Dashboard({ payload, user, i18n }: Props) {
  if (!user) return null;
  const en = i18n?.language === 'en';
  const editor = canPublish(user as never);
  const admin = (path: `/${string}`) => formatAdminURL({ adminRoute: payload.config.routes.admin, path });
  const fmt = new Intl.DateTimeFormat(en ? 'en-GB' : 'vi-VN', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' });
  const asUser = { overrideAccess: false, user: user as never } as const;

  const findNews = (where: Where, limit: number, sort = '-updatedAt') =>
    payload
      .find({
        collection: 'news',
        where,
        limit,
        sort,
        depth: 0,
        draft: true,
        select: { title: true, updatedAt: true, reviewStatus: true },
        ...asUser,
      })
      .catch(() => ({ docs: [] as Row[], totalDocs: 0 }));

  const nowISO = new Date().toISOString();
  const [myDrafts, pending, publishedToday, contactNew, jobs] = await Promise.all([
    findNews({ and: [{ author: { equals: user.id } }, { _status: { equals: 'draft' } }] }, 5),
    editor ? findNews({ reviewStatus: { equals: 'pending' } }, 5, 'updatedAt') : Promise.resolve(null),
    payload
      .count({
        collection: 'news',
        where: { and: [{ _status: { equals: 'published' } }, { publishedAt: { greater_than_equal: startOfTodayVN() } }] },
        ...asUser,
      })
      .catch(() => ({ totalDocs: 0 })),
    editor
      ? payload.count({ collection: 'contact-requests', where: { status: { equals: 'new' } }, ...asUser }).catch(() => null)
      : Promise.resolve(null),
    payload
      .find({
        collection: 'payload-jobs',
        where: {
          and: [
            { taskSlug: { equals: 'schedulePublish' } },
            { completedAt: { exists: false } },
            { waitUntil: { greater_than: nowISO } },
          ],
        },
        sort: 'waitUntil',
        limit: 20,
        depth: 0,
        overrideAccess: true,
      })
      .catch(() => ({ docs: [] as unknown[], totalDocs: 0 })),
  ]);

  // Scheduled news publishes (+ titles in one query).
  type Job = { id: number | string; waitUntil?: string; input?: { type?: string; doc?: { relationTo?: string; value?: string | number } } };
  const newsJobs = (jobs.docs as Job[]).filter((j) => j.input?.doc?.relationTo === 'news');
  const jobDocIds = [...new Set(newsJobs.map((j) => j.input?.doc?.value).filter((v) => v != null))] as (string | number)[];
  const titles = new Map<string, string>();
  if (jobDocIds.length) {
    const res = await findNews({ id: { in: jobDocIds } }, jobDocIds.length);
    for (const d of res.docs as Row[]) titles.set(String(d.id), d.title || '');
  }
  const scheduled = newsJobs.filter((j) => titles.has(String(j.input?.doc?.value)));

  const untitled = en ? '(untitled)' : '(chưa có tiêu đề)';
  const newsLink = (id: number | string) => admin(`/collections/news/${id}`);
  const t = (vi: string, enText: string) => (en ? enText : vi);

  const stats = [
    {
      key: 'drafts',
      label: t('Bài nháp của tôi', 'My drafts'),
      value: myDrafts.totalDocs,
      href: admin(`/collections/news?where[author][equals]=${user.id}&where[_status][equals]=draft`),
    },
    ...(pending
      ? [
          {
            key: 'pending',
            label: t('Chờ duyệt', 'Awaiting review'),
            value: pending.totalDocs,
            href: admin('/collections/news?where[reviewStatus][equals]=pending'),
            highlight: pending.totalDocs > 0,
          },
        ]
      : []),
    { key: 'scheduled', label: t('Đã hẹn giờ', 'Scheduled'), value: scheduled.filter((j) => j.input?.type !== 'unpublish').length },
    {
      key: 'today',
      label: t('Đăng hôm nay', 'Published today'),
      value: publishedToday.totalDocs,
      href: admin('/collections/news?where[_status][equals]=published'),
    },
    ...(contactNew
      ? [
          {
            key: 'contact',
            label: t('Liên hệ mới', 'New contact requests'),
            value: contactNew.totalDocs,
            href: admin('/collections/contact-requests?where[status][equals]=new'),
            highlight: contactNew.totalDocs > 0,
          },
        ]
      : []),
  ];

  return (
    <section className="bh-desk" aria-label={t('Bàn biên tập', 'Newsroom desk')}>
      <header className="bh-desk__head">
        <div>
          <h2 className="bh-desk__title">
            {t('Xin chào', 'Hello')}, {user.name || t('bạn', 'there')}
          </h2>
          <p className="bh-desk__sub">
            {editor
              ? t('Duyệt bài, lên lịch đăng và theo dõi hộp thư tại đây.', 'Review, schedule and keep an eye on the inbox here.')
              : t(
                  'Viết bài, rồi chuyển "Trạng thái biên tập" sang "Chờ duyệt" để biên tập viên duyệt và đăng.',
                  'Write, then set "Review status" to "Awaiting review" so an editor can publish it.',
                )}
          </p>
        </div>
        <Link href={admin('/collections/news/create')} className="bh-desk__cta" prefetch={false}>
          + {t('Viết bài mới', 'New article')}
        </Link>
      </header>

      <ul className="bh-desk__stats">
        {stats.map((s) => {
          const body = (
            <>
              <span className="bh-desk__stat-value">{s.value}</span>
              <span className="bh-desk__stat-label">{s.label}</span>
            </>
          );
          return (
            <li key={s.key} className={`bh-desk__stat${'highlight' in s && s.highlight ? ' is-highlight' : ''}`}>
              {'href' in s && s.href ? (
                <Link href={s.href} prefetch={false}>
                  {body}
                </Link>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="bh-desk__lists">
        <DeskList
          title={t('Bài nháp gần đây của tôi', 'My recent drafts')}
          empty={t('Chưa có bản nháp nào.', 'No drafts yet.')}
          items={(myDrafts.docs as Row[]).map((d) => ({
            id: d.id,
            href: newsLink(d.id),
            title: d.title || untitled,
            meta: d.updatedAt ? `${t('Sửa', 'Edited')} ${fmt.format(new Date(d.updatedAt))}` : '',
            badge: d.reviewStatus === 'pending' ? t('Chờ duyệt', 'In review') : d.reviewStatus === 'changes' ? t('Cần sửa', 'Needs changes') : '',
          }))}
        />
        {pending && (
          <DeskList
            title={t('Chờ duyệt', 'Awaiting review')}
            empty={t('Không có bài nào chờ duyệt.', 'Nothing to review.')}
            items={(pending.docs as Row[]).map((d) => ({
              id: d.id,
              href: newsLink(d.id),
              title: d.title || untitled,
              meta: d.updatedAt ? `${t('Gửi', 'Sent')} ${fmt.format(new Date(d.updatedAt))}` : '',
            }))}
          />
        )}
        <DeskList
          title={t('Lịch đăng / gỡ sắp tới', 'Upcoming schedule')}
          empty={t('Chưa có bài nào được hẹn giờ.', 'Nothing scheduled.')}
          items={scheduled.slice(0, 6).map((j) => ({
            id: j.id,
            href: newsLink(j.input!.doc!.value!),
            title: titles.get(String(j.input?.doc?.value)) || untitled,
            meta: j.waitUntil ? fmt.format(new Date(j.waitUntil)) : '',
            badge: j.input?.type === 'unpublish' ? t('Gỡ bài', 'Unpublish') : t('Đăng', 'Publish'),
          }))}
        />
      </div>
    </section>
  );
}

function DeskList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { id: number | string; href: string; title: string; meta?: string; badge?: string }[];
}) {
  return (
    <div className="bh-desk__list">
      <h3 className="bh-desk__list-title">{title}</h3>
      {items.length === 0 ? (
        <p className="bh-desk__empty">{empty}</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <Link href={it.href} prefetch={false}>
                <span className="bh-desk__item-title">{it.title}</span>
                <span className="bh-desk__item-meta">
                  {it.badge ? <span className="bh-badge bh-badge--info">{it.badge}</span> : null}
                  {it.meta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
