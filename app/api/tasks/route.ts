import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${backendUrl}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: authHeader || "",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Tasks GET proxy error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${backendUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Tasks POST proxy error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
