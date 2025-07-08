"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Zap } from "lucide-react"
import TaskModal from "./task-modal"
import ConflictModal from "./conflict-modal"

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

interface KanbanBoardProps {
  tasks: Task[]
  users: User[]
  currentUser: User | null
  socket: any
  onTasksChange: (tasks: Task[]) => void
}

const columns = ["Todo", "In Progress", "Done"] as const

export default function KanbanBoard({ tasks, users, currentUser, socket, onTasksChange }: KanbanBoardProps) {
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [conflictData, setConflictData] = useState<any>(null)

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleSmartAssign = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${taskId}/smart-assign`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const updatedTask = await response.json()
        onTasksChange(tasks.map((task) => (task._id === taskId ? updatedTask : task)))
      }
    } catch (error) {
      console.error("Error smart assigning task:", error)
    }
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, newStatus: (typeof columns)[number]) => {
    e.preventDefault()

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${draggedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...draggedTask,
          status: newStatus,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        onTasksChange(tasks.map((task) => (task._id === draggedTask._id ? updatedTask : task)))
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }

    setDraggedTask(null)
  }

  const getTasksByStatus = (status: (typeof columns)[number]) => {
    return tasks.filter((task) => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-red-500"
      case "Medium":
        return "border-l-yellow-500"
      case "Low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Board</h2>
        <button
          onClick={handleCreateTask}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column}
            className="bg-white rounded-lg shadow-sm border p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{column}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {getTasksByStatus(column).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column).map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    <button
                      onClick={() => handleSmartAssign(task._id)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Smart Assign"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{task.assignedTo.name}</span>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
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

                  <button
                    onClick={() => handleEditTask(task)}
                    className="mt-3 w-full text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Edit Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          users={users}
          onClose={() => setShowTaskModal(false)}
          onSave={(taskData) => {
            // Handle task save
            setShowTaskModal(false)
          }}
        />
      )}

      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={(resolution) => {
            // Handle conflict resolution
            setConflictData(null)
          }}
          onClose={() => setConflictData(null)}
        />
      )}
    </div>
  )
}
