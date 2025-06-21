import { type NextRequest, NextResponse } from "next/server"

const NASA_API_KEY = "a30wQ4Pdaf01Swtg9A87B1o5TuonqI2eDt12WO0a"
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  try {
    let url = `${NASA_APOD_URL}?api_key=${NASA_API_KEY}`
    if (date) {
      url += `&date=${date}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch APOD data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching APOD:", error)
    return NextResponse.json({ error: "Failed to fetch APOD data" }, { status: 500 })
  }
}
