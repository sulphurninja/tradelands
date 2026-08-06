import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/Project";
import { serializeProject } from "@/lib/serialize";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const doc = await ProjectModel.findById(id).lean();
  if (!doc) notFound();
  const project = serializeProject(doc as never);

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">Edit {project.name}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
