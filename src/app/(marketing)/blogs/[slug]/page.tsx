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
    <article className="pt-28 pb-24">
      <div className="container-premium section-pad max-w-3xl">
        <p className="text-[0.7rem] tracking-[0.28em] text-primary uppercase">
          {post.category} · {post.readTime}
        </p>
        <h1 className="font-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {post.author} · {post.publishedAt}
        </p>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.coverImage} alt="" fill className="object-cover" />
        </div>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground/90">
          <p>{post.excerpt}</p>
          {"body" in post && post.body ? <p className="text-muted-foreground">{post.body}</p> : null}
        </div>
      </div>
    </article>
  );
}
