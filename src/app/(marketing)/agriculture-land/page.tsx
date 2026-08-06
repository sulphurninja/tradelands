import { CategoryPage } from "@/components/projects/category-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agriculture Land",
};

export default function AgricultureLandPage() {
  return (
    <CategoryPage
      category="agriculture-land"
      href="/agriculture-land"
      eyebrow="Agriculture Land"
      title="Agriculture land with clear titles"
      description="Plots for plantation or a future farm house — with papers, layouts, and pricing online."
      image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
      extras={[
        "Drone & gallery",
        "Plot layouts",
        "Legal documents",
        "Plantation options",
        "Farm house support",
        "Online booking",
      ]}
    />
  );
}
