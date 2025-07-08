"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import KanbanBoard from "@/components/kanban-board"
import ActivityLog from "@/components/activity-log"
import { LogOut, Users } from "lucide-react"
import io from "socket.io-client"

interface User {
  _id: string
  name: string
  email: string
}

interface Task {
  _id: string
  title: string
  description: string
  status: "Todo" | "In Progress" | "Done"
  priority: "Low" | "Medium" | "High"
  assignedTo: User
  createdBy: User
  createdAt: string
  updatedAt: string
}

interface Activity {
  _id: string
  action: string
  user: User
  task?: Task
  timestamp: string
}

export default function BoardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [socket, setSocket] = useState<any>(null)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    })

    setSocket(newSocket)

    // Socket event listeners
    newSocket.on("taskUpdated", (updatedTask: Task) => {
      setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
    })

    newSocket.on("taskCreated", (newTask: Task) => {
      setTasks((prev) => [...prev, newTask])
    })

    newSocket.on("taskDeleted", (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
    })

    newSocket.on("activityAdded", (activity: Activity) => {
      setActivities((prev) => [activity, ...prev.slice(0, 19)])
    })

    // Fetch initial data
    fetchTasks()
    fetchActivities()
    fetchUsers()

    return () => {
      newSocket.disconnect()
    }
  }, [router])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (socket) {
      socket.disconnect()
    }
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <div className="ml-4 flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {users.length} users online
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>

              <button
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Activity Log
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Kanban Board */}
          <div className={`transition-all duration-300 ${showActivityLog ? "w-2/3" : "w-full"}`}>
            <KanbanBoard tasks={tasks} users={users} currentUser={user} socket={socket} onTasksChange={setTasks} />
          </div>

          {/* Activity Log Sidebar */}
          {showActivityLog && (
            <div className="w-1/3 transition-all duration-300">
              <ActivityLog activities={activities} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
