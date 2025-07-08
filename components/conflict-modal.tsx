"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"

interface ConflictModalProps {
  conflictData: {
    taskId: string
    currentVersion: any
    incomingVersion: any
    conflictFields: string[]
  }
  onResolve: (resolution: any) => void
  onClose: () => void
}

export default function ConflictModal({ conflictData, onResolve, onClose }: ConflictModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<"current" | "incoming" | "merge">("merge")
  const [mergedData, setMergedData] = useState(conflictData.currentVersion)

  const handleResolve = () => {
    let resolution

    switch (selectedVersion) {
      case "current":
        resolution = conflictData.currentVersion
        break
      case "incoming":
        resolution = conflictData.incomingVersion
        break
      case "merge":
        resolution = mergedData
        break
    }

    onResolve(resolution)
  }

  const handleFieldChange = (field: string, value: any) => {
    setMergedData({
      ...mergedData,
      [field]: value,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Conflict Detected</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            This task was modified by another user while you were editing it. Please choose how to resolve the conflict:
          </p>

          <div className="space-y-4 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="resolution"
                value="current"
                checked={selectedVersion === "current"}
                onChange={(e) => setSelectedVersion(e.target.value as any)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">Keep your version</div>
                <div className="text-sm text-gray-600">Discard the other user's changes</div>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="resolution"
                value="incoming"
                checked={selectedVersion === "incoming"}
                onChange={(e) => setSelectedVersion(e.target.value as any)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">Accept their version</div>
                <div className="text-sm text-gray-600">Discard your changes</div>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="resolution"
                value="merge"
                checked={selectedVersion === "merge"}
                onChange={(e) => setSelectedVersion(e.target.value as any)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">Merge changes</div>
                <div className="text-sm text-gray-600">Manually combine both versions</div>
              </div>
            </label>
          </div>

          {selectedVersion === "merge" && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Merge Conflicts</h4>
              <div className="space-y-4">
                {conflictData.conflictFields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Your version:</div>
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          {conflictData.currentVersion[field]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Their version:</div>
                        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                          {conflictData.incomingVersion[field]}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={mergedData[field]}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter merged value"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Resolve Conflict
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
