"use client"

import { useState } from "react"

interface Document {
  id: string
  filename: string
  status: "draft" | "approved" | "archived"
  created_at: string
  file_type: string
  file_size: number
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]

const ALLOWED_EXTENSIONS = ".pdf,.docx,.txt,.md"
const MAX_FILE_SIZE = 10 * 1024 * 1024

export function DocumentManager({
  initialDocuments,
  authPayload,
}: {
  initialDocuments: Document[]
  authPayload: string
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const fileInput = (e.currentTarget.elements.namedItem("file") as HTMLInputElement)
    const file = fileInput?.files?.[0]

    if (!file) {
      setError("Please select a file")
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Allowed: PDF, DOCX, TXT, MD")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10MB")
      return
    }

    setUploading(true)

    try {
      const body = new FormData()
      body.append("file", file)
      body.append("authPayload", authPayload)

      const res = await fetch("/api/documents", {
        method: "POST",
        body,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Upload failed")
        setUploading(false)
        return
      }

      setDocuments((prev) => [data.document, ...prev])
      setMessage(`Uploaded ${file.name}`)
      e.currentTarget.reset()
    } catch {
      setError("Network error. Please try again.")
    }

    setUploading(false)
  }

  async function updateStatus(
    docId: string,
    action: "approve" | "archive" | "draft" | "delete"
  ) {
    setError(null)
    setMessage(null)

    if (action === "delete") {
      if (!confirm("Delete this document permanently?")) return
    }

    try {
      const url =
        action === "delete"
          ? `/api/documents/${docId}?authPayload=${encodeURIComponent(authPayload)}`
          : `/api/documents/${docId}`

      const method = action === "delete" ? "DELETE" : "PATCH"
      const body =
        action === "delete"
          ? undefined
          : JSON.stringify({ action, authPayload })

      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Action failed")
        return
      }

      if (action === "delete") {
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        setMessage("Document deleted")
      } else {
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, status: data.status as Document["status"] } : d))
        )
        setMessage(`Document ${action}d`)
      }
    } catch {
      setError("Network error. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="font-semibold">Upload Document</h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <div>
            <input
              type="file"
              name="file"
              accept={ALLOWED_EXTENSIONS}
              className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <span className="text-xs text-muted-foreground">
              PDF, DOCX, TXT, MD &middot; Max 10MB
            </span>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-500 bg-green-50 p-3">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Filename</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Uploaded</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="px-4 py-2 max-w-[200px] truncate" title={doc.filename}>
                  {doc.filename}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    {doc.status === "draft" && (
                      <button
                        onClick={() => updateStatus(doc.id, "approve")}
                        className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                    {doc.status === "approved" && (
                      <button
                        onClick={() => updateStatus(doc.id, "archive")}
                        className="rounded bg-gray-600 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700"
                      >
                        Archive
                      </button>
                    )}
                    {doc.status === "archived" && (
                      <button
                        onClick={() => updateStatus(doc.id, "draft")}
                        className="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700"
                      >
                        Re-draft
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(doc.id, "delete")}
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No documents yet. Upload your first document above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
