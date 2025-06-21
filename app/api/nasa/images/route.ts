import { type NextRequest, NextResponse } from "next/server"

const NASA_IMAGES_URL = "https://images-api.nasa.gov/search"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const query = searchParams.get("q") || "space exploration"

  try {
    let url = `${NASA_IMAGES_URL}?q=${encodeURIComponent(query)}&media_type=image`
    if (year) {
      url += `&year_start=${year}&year_end=${year}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch NASA images")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching NASA images:", error)
    return NextResponse.json({ error: "Failed to fetch NASA images" }, { status: 500 })
  }
}
