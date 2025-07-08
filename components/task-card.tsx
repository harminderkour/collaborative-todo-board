"use client"

import { useState } from "react"
import { Edit, Trash2, Calendar } from "lucide-react"

interface Task {
  _id: string
  title: string
  description: string
  status: "Todo" | "In Progress" | "Done"
  priority: "Low" | "Medium" | "High"
  assignedTo: { _id: string; name: string; email: string }
  createdBy: { _id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onSmartAssign: (taskId: string) => void
}

export default function TaskCard({ task, onEdit, onDelete, onSmartAssign }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-red-500 bg-red-50"
      case "Medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "Low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-all duration-200 transform ${
        isHovered ? "scale-105" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-indigo-600">{task.assignedTo.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-xs text-gray-600 truncate max-w-20">{task.assignedTo.name}</span>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            task.priority === "High"
              ? "bg-red-100 text-red-700"
              : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        <button
          onClick={() => onSmartAssign(task._id)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          title="Smart assign to user with least tasks"
        >
          Auto-assign
        </button>
      </div>

      {task.createdBy._id !== task.assignedTo._id && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Created by {task.createdBy.name}</span>
          </div>
        </div>
      )}
    </div>
  )
}
