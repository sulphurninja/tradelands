import { PageHero } from "@/components/layout/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Speak with the investment desk"
        description="Prefer WhatsApp, phone, or a written brief — we respond with project-matched clarity."
        crumbs={[{ href: "/contact", label: "Contact" }]}
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">TradeLands.IND</h2>
            <dl className="mt-8 space-y-5 text-sm">
              <div>
                <dt className="tracking-[0.16em] text-muted-foreground uppercase">
                  Phone
                </dt>
                <dd className="mt-1 text-lg">{SITE.phone}</dd>
              </div>
              <div>
                <dt className="tracking-[0.16em] text-muted-foreground uppercase">
                  Email
                </dt>
                <dd className="mt-1 text-lg">{SITE.email}</dd>
              </div>
              <div>
                <dt className="tracking-[0.16em] text-muted-foreground uppercase">
                  Presence
                </dt>
                <dd className="mt-1 text-lg">{SITE.address}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-8">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
