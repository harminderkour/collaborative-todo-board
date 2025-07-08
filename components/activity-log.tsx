"use client"

import { Clock, Edit, Plus, Trash2, Move } from "lucide-react"

interface Task {
  _id: string
  title: string
  description: string
  status: "Todo" | "In Progress" | "Done"
  priority: "Low" | "Medium" | "High"
  assignedTo: any
  createdBy: any
  createdAt: string
  updatedAt: string
}

interface Activity {
  _id: string
  action: string
  user: any
  task?: Task
  timestamp: string
}

interface ActivityLogProps {
  activities: Activity[]
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const getActionIcon = (action: string) => {
    if (action.includes("created")) return <Plus className="w-4 h-4 text-green-600" />
    if (action.includes("updated") || action.includes("edited")) return <Edit className="w-4 h-4 text-blue-600" />
    if (action.includes("deleted")) return <Trash2 className="w-4 h-4 text-red-600" />
    if (action.includes("moved") || action.includes("assigned")) return <Move className="w-4 h-4 text-purple-600" />
    return <Clock className="w-4 h-4 text-gray-600" />
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-900">Recent Activity</h3>
        </div>
      </div>

      <div className="p-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getActionIcon(activity.action)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600">
                        {activity.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{activity.user.name}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">{activity.action}</p>

                  {activity.task && (
                    <p className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 inline-block">
                      {activity.task.title}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
