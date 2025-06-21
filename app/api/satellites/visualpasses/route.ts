import { type NextRequest, NextResponse } from "next/server"

const N2YO_API_KEY = "7DED2W-6G9E7Y-X3RJTA-5IDL"
const N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const observerLat = searchParams.get("observer_lat") || "41.702"
  const observerLng = searchParams.get("observer_lng") || "-76.014"
  const observerAlt = searchParams.get("observer_alt") || "0"
  const days = searchParams.get("days") || "10"
  const minElevation = searchParams.get("min_elevation") || "30"

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${N2YO_BASE_URL}/visualpasses/${id}/${observerLat}/${observerLng}/${observerAlt}/${days}/${minElevation}/?apiKey=${N2YO_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch satellite visual passes")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching satellite visual passes:", error)
    return NextResponse.json({ error: "Failed to fetch satellite visual passes" }, { status: 500 })
  }
}
