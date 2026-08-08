import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogBySlug, getBlogSlugs } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <article className="overflow-x-clip pt-24 pb-20 sm:pt-28 sm:pb-24">
      <div className="container-premium section-pad max-w-3xl">
        <p className="text-[0.7rem] tracking-[0.28em] text-primary uppercase">
          {post.category} · {post.readTime}
        </p>
        <h1 className="font-display mt-4 text-[1.85rem] leading-[1.1] break-words sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          {post.author} · {post.publishedAt}
        </p>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-black sm:mt-10">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <div className="mt-8 space-y-5 text-base leading-relaxed break-words text-foreground/90 sm:mt-10 sm:text-lg">
          <p>{post.excerpt}</p>
          {"body" in post && post.body ? (
            <p className="text-muted-foreground">{post.body}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
