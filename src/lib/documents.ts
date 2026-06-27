import { createAdminClient } from "./supabase/admin"
import { generateEmbedding } from "./openai"

export async function ensureDocumentsBucket() {
  const supabase = createAdminClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === "documents")) {
    await supabase.storage.createBucket("documents", {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
    })
  }
}

async function extractTextFromFile(
  bucket: string,
  filePath: string,
  fileType: string
): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage.from(bucket).download(filePath)
  if (error || !data) throw new Error("Failed to download file")
  const buffer = Buffer.from(await data.arrayBuffer())

  if (fileType === "pdf") {
    if (typeof globalThis.DOMMatrix === "undefined") {
      const CSSMatrix = (await import("dommatrix")).default
      ;(globalThis as any).DOMMatrix = CSSMatrix
    }
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    const text = result.text || ""
    parser.destroy()
    return text
  } else if (fileType === "docx") {
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } else {
    return buffer.toString("utf-8")
  }
}

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start += chunkSize - overlap
  }
  return chunks
}

export async function processDocument(documentId: string, tenantId: string) {
  const supabase = createAdminClient()

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, tenant_id, file_path, file_type")
    .eq("id", documentId)
    .single()

  if (error || !doc) throw new Error("Document not found")

  const text = await extractTextFromFile("documents", doc.file_path, doc.file_type)
  if (!text.trim()) {
    await supabase
      .from("documents")
      .update({ status: "archived" })
      .eq("id", documentId)
    throw new Error("Document contains no extractable text")
  }

  await supabase.from("document_chunks").delete().eq("document_id", documentId)

  const chunks = chunkText(text)
  const chunkRecords: {
    document_id: string
    tenant_id: string
    content: string
    chunk_index: number
    embedding: string
  }[] = []

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i])
    chunkRecords.push({
      document_id: documentId,
      tenant_id: tenantId,
      content: chunks[i],
      chunk_index: i,
      embedding: `[${embedding.join(",")}]`,
    })
  }

  const { error: insertError } = await supabase
    .from("document_chunks")
    .insert(chunkRecords)

  if (insertError) throw insertError

  await supabase
    .from("documents")
    .update({ status: "approved" })
    .eq("id", documentId)
}

export async function reindexDocument(documentId: string) {
  const supabase = createAdminClient()
  const { data: doc } = await supabase
    .from("documents")
    .select("tenant_id")
    .eq("id", documentId)
    .single()

  if (!doc) throw new Error("Document not found")
  await processDocument(documentId, doc.tenant_id)
}
