import { ProjectForm } from "@/components/admin/project-form";

export const metadata = { title: "Admin · New Project" };

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">New project</h1>
      <ProjectForm />
    </div>
  );
}
