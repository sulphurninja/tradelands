import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { serializeBlog } from "@/lib/serialize";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const doc = await Blog.findById(id).lean();
  if (!doc) notFound();
  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">Edit blog</h1>
      <BlogForm blog={serializeBlog(doc as never)} />
    </div>
  );
}
