import { type NextRequest, NextResponse } from "next/server"

const WIKIPEDIA_API_URL = "https://en.wikipedia.org/api/rest_v1/page/summary"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")

  if (!title) {
    return NextResponse.json({ error: "Title parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${WIKIPEDIA_API_URL}/${encodeURIComponent(title)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch Wikipedia data")
    }

    const data = await response.json()
    return NextResponse.json({ pages: { [title]: data } })
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error)
    return NextResponse.json({ error: "Failed to fetch Wikipedia data" }, { status: 500 })
  }
}
