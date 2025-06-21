import { type NextRequest, NextResponse } from "next/server"

const N2YO_API_KEY = "7DED2W-6G9E7Y-X3RJTA-5IDL"
const BASE = "https://api.n2yo.com/rest/v1/satellite"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const lat = searchParams.get("observer_lat") ?? "41.702"
  const lng = searchParams.get("observer_lng") ?? "-76.014"
  const alt = searchParams.get("observer_alt") ?? "0"
  const seconds = searchParams.get("seconds") ?? "60"

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
  }

  try {
    const url = `${BASE}/positions/${id}/${lat}/${lng}/${alt}/${seconds}/?apiKey=${N2YO_API_KEY}`
    const res = await fetch(url, { next: { revalidate: 30 } })

    if (!res.ok) {
      // N2YO answered but with an error code (403, 429, …)
      const text = await res.text()
      return NextResponse.json({ error: `Upstream error (${res.status})`, details: text }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data) // 200
  } catch (e) {
    console.error("N2YO fetch failed:", e)
    /*  We still reply with 200 so the client fetch does NOT throw a network-error */
    return NextResponse.json({ error: "Failed to reach N2YO upstream" }, { status: 200 })
  }
}
