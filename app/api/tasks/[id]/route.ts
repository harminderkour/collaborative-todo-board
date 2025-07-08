import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${backendUrl}/api/tasks/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Tasks PUT proxy error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const authHeader = request.headers.get("authorization")

    const response = await fetch(`${backendUrl}/api/tasks/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader || "",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Tasks DELETE proxy error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
