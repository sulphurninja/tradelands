import { CategoryPage } from "@/components/projects/category-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "NA Villa Plot",
};

export default function NaVillaPlotPage() {
  return (
    <CategoryPage
      category="na-villa-plot"
      href="/na-villa-plot"
      eyebrow="NA Villa Plots"
      title="NA plots ready for villa living"
      description="Converted plots with roads, club facilities, and clear villa build packages."
      image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
      extras={[
        "Villa designs",
        "Construction packages",
        "Interior options",
        "Pool add-ons",
        "Club house",
        "Build timeline",
      ]}
    />
  );
}
