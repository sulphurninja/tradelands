import Link from "next/link";
import { connectDB } from "@/lib/db";
import { SaleLandListing } from "@/models/SaleLandListing";
import { SaleLandStatusSelect } from "@/components/admin/sale-land-status-select";
import { DeleteButton } from "@/components/admin/delete-button";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Sell Land" };

export default async function AdminSaleLandPage() {
  await connectDB();
  const rows = await SaleLandListing.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PortalPageHeader
        title="Sell land"
        description="Land sale submissions from the website — review, contact sellers, and update status."
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Owner</th>
                <th className="px-4 py-3 text-left font-medium">Land size</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Rate</th>
                <th className="px-4 py-3 text-left font-medium">Files</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Received</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const photos = (row.photos as string[]) || [];
                const documents = (row.documents as string[]) || [];
                const created = row.createdAt
                  ? new Date(String(row.createdAt)).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—";
                return (
                  <tr key={String(row._id)} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.name}</p>
                      <a
                        href={`tel:${row.phone}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {row.phone}
                      </a>
                      {row.email ? (
                        <a
                          href={`mailto:${row.email}`}
                          className="mt-0.5 block text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          {String(row.email)}
                        </a>
                      ) : null}
                      {row.notes ? (
                        <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
                          {String(row.notes)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.landSize || "—"}
                    </td>
                    <td className="max-w-[240px] px-4 py-3">
                      <p className="whitespace-pre-wrap break-words text-muted-foreground">
                        {row.pinLocation}
                      </p>
                      {/https?:\/\//i.test(String(row.pinLocation)) ? (
                        <Link
                          href={String(row.pinLocation)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs text-primary hover:underline"
                        >
                          Open map
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums">
                      {row.rate || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {photos.slice(0, 3).map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block size-12 overflow-hidden rounded-md border border-border bg-muted"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt=""
                              className="size-full object-cover"
                            />
                          </a>
                        ))}
                        {documents.map((url, i) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-12 items-center rounded-md border border-border bg-muted px-2 text-[10px] font-medium"
                          >
                            Doc {i + 1}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SaleLandStatusSelect
                        id={String(row._id)}
                        status={String(row.status || "new")}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {created}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton
                        endpoint={`/api/admin/sale-land/${String(row._id)}`}
                        label="Delete"
                      />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No land sale submissions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </PortalPanel>
    </div>
  );
}
