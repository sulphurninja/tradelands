import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { getBlogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blogs",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Blogs & field notes"
        description="Simple guides on land papers, NA plots, and plantation basics."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-[0.68rem] tracking-[0.18em] text-primary uppercase">
                {post.category}
              </p>
              <h2 className="font-display mt-2 text-2xl group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
