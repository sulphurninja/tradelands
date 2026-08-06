import { NextResponse } from "next/server";
import { getProjects } from "@/lib/queries";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { error: "Unable to load projects", projects: [] },
      { status: 500 }
    );
  }
}
