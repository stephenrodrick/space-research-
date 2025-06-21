import { type NextRequest, NextResponse } from "next/server"

const N2YO_API_KEY = "7DED2W-6G9E7Y-X3RJTA-5IDL"
const N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const alt = searchParams.get("alt") || "0" // altitude [m]
  const radius = searchParams.get("radius") || "90" // search radius [deg] (max 90)
  const category = searchParams.get("category") || "0" // 0 = all categories

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${N2YO_BASE_URL}/above/${lat}/${lng}/${alt}/${radius}/${category}/?apiKey=${N2YO_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch satellites above location")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching satellites above location:", error)
    return NextResponse.json({ error: "Failed to fetch satellites above location" }, { status: 500 })
  }
}
