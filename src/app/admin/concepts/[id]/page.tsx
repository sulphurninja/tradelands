import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Concept } from "@/models/Concept";
import { serializeConcept } from "@/lib/serialize";
import { ConceptForm } from "@/components/admin/concept-form";

export const dynamic = "force-dynamic";

export default async function EditConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const doc = await Concept.findById(id).lean();
  if (!doc) notFound();
  return (
    <div>
      <h1 className="font-display mb-6 text-3xl">Edit concept</h1>
      <ConceptForm concept={serializeConcept(doc as never)} />
    </div>
  );
}
