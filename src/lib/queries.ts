import { connectDB } from "@/lib/db";
import {
  serializeBlog,
  serializeConcept,
  serializeMedia,
  serializeOffer,
  serializeProject,
  serializeReview,
} from "@/lib/serialize";
import { ProjectModel } from "@/models/Project";
import { Concept } from "@/models/Concept";
import { Blog } from "@/models/Blog";
import { Review } from "@/models/Review";
import { Offer } from "@/models/Offer";
import { Media } from "@/models/Media";
import { Lead } from "@/models/Lead";
import { SiteVisit } from "@/models/SiteVisit";
import { User } from "@/models/User";
import type { ProjectCategory } from "@/lib/types";

export async function getProjects() {
  await connectDB();
  const docs = await ProjectModel.find().sort({ featured: -1, createdAt: -1 }).lean();
  return docs.map((d) => serializeProject(d as never));
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const doc = await ProjectModel.findOne({ slug }).lean();
  return doc ? serializeProject(doc as never) : null;
}

export async function getProjectsByCategory(category: ProjectCategory) {
  await connectDB();
  const docs = await ProjectModel.find({ category }).sort({ featured: -1 }).lean();
  return docs.map((d) => serializeProject(d as never));
}

export async function getFeaturedProjects() {
  await connectDB();
  const docs = await ProjectModel.find({ featured: true }).limit(6).lean();
  return docs.map((d) => serializeProject(d as never));
}

export async function getProjectsByStatus(status: string) {
  await connectDB();
  const docs = await ProjectModel.find({ status }).lean();
  return docs.map((d) => serializeProject(d as never));
}

export async function getProjectSlugs() {
  await connectDB();
  const docs = await ProjectModel.find({}, { slug: 1 }).lean();
  return docs.map((d) => String((d as { slug: string }).slug));
}

export async function getConcepts() {
  await connectDB();
  const docs = await Concept.find().lean();
  return docs.map((d) => serializeConcept(d as never));
}

export async function getConceptBySlug(slug: string) {
  await connectDB();
  const doc = await Concept.findOne({ slug }).lean();
  return doc ? serializeConcept(doc as never) : null;
}

export async function getConceptSlugs() {
  await connectDB();
  const docs = await Concept.find({}, { slug: 1 }).lean();
  return docs.map((d) => String((d as { slug: string }).slug));
}

export async function getBlogs() {
  await connectDB();
  const docs = await Blog.find().sort({ publishedAt: -1 }).lean();
  return docs.map((d) => serializeBlog(d as never));
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const doc = await Blog.findOne({ slug }).lean();
  return doc ? serializeBlog(doc as never) : null;
}

export async function getBlogSlugs() {
  await connectDB();
  const docs = await Blog.find({}, { slug: 1 }).lean();
  return docs.map((d) => String((d as { slug: string }).slug));
}

export async function getReviews() {
  await connectDB();
  const docs = await Review.find().lean();
  return docs.map((d) => serializeReview(d as never));
}

export async function getOffers(options?: { activeOnly?: boolean }) {
  await connectDB();
  const query = options?.activeOnly ? { active: true } : {};
  const docs = await Offer.find(query)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return docs.map((d) => serializeOffer(d as never));
}

export async function getMedia(filters?: { category?: string; type?: string }) {
  await connectDB();
  const query: Record<string, string> = {};
  if (filters?.category) query.category = filters.category;
  if (filters?.type) query.type = filters.type;
  const docs = await Media.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return docs.map((d) => serializeMedia(d as never));
}

export async function getAdminStats() {
  await connectDB();
  const [
    projects,
    blogs,
    concepts,
    reviews,
    offers,
    media,
    leads,
    visits,
    users,
  ] = await Promise.all([
    ProjectModel.countDocuments(),
    Blog.countDocuments(),
    Concept.countDocuments(),
    Review.countDocuments(),
    Offer.countDocuments(),
    Media.countDocuments(),
    Lead.countDocuments(),
    SiteVisit.countDocuments(),
    User.countDocuments(),
  ]);
  return {
    projects,
    blogs,
    concepts,
    reviews,
    offers,
    media,
    leads,
    visits,
    users,
  };
}
