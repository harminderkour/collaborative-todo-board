import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${backendUrl}/api/activities`, {
      method: "GET",
      headers: {
        Authorization: authHeader || "",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Activities proxy error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
