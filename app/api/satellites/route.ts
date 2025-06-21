import { type NextRequest, NextResponse } from "next/server"

const N2YO_API_KEY = "7DED2W-6G9E7Y-X3RJTA-5IDL"
const N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "stations"

  try {
    // Get satellites above a default location (ISS and space stations)
    const response = await fetch(`${N2YO_BASE_URL}/above/41.702/-76.014/0/70/25/?apiKey=${N2YO_API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch satellite data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching satellites:", error)
    return NextResponse.json({ error: "Failed to fetch satellite data" }, { status: 500 })
  }
}
