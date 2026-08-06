import { BlogForm } from "@/components/admin/blog-form";

export const metadata = { title: "Admin · New Blog" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">New blog</h1>
      <BlogForm />
    </div>
  );
}
