import type { AuthPayload } from "@/lib/auth";

/** Agents see their attributed records; admins/superadmins see all. */
export function agentLeadFilter(session: AuthPayload) {
  if (session.role === "sales") {
    return { agentId: session.sub };
  }
  return {};
}

export function agentVisitFilter(session: AuthPayload) {
  if (session.role === "sales") {
    return { agentId: session.sub };
  }
  return {};
}
