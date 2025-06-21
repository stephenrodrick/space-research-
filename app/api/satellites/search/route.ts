import { type NextRequest, NextResponse } from "next/server"

const N2YO_API_KEY = "7DED2W-6G9E7Y-X3RJTA-5IDL"
const N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${N2YO_BASE_URL}/searchByName/${encodeURIComponent(name)}/?apiKey=${N2YO_API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to search satellites")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching satellites:", error)
    return NextResponse.json({ error: "Failed to search satellites" }, { status: 500 })
  }
}
