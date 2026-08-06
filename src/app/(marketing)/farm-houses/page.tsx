import { CategoryPage } from "@/components/projects/category-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Farm Houses",
};

export default function FarmHousesPage() {
  return (
    <CategoryPage
      category="farm-house"
      href="/farm-houses"
      eyebrow="Farm Houses"
      title="Farm houses, ready or custom"
      description="Modern, traditional, prefab, and glass homes — with floor plans, pricing, and timelines."
      image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
      extras={[
        "Luxury & modern",
        "Traditional homes",
        "Prefab & glass",
        "Custom designs",
        "Interior galleries",
        "Build timeline",
      ]}
    />
  );
}
