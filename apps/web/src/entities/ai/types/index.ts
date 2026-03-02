export interface GenerateDocumentRequest {
  prompt: string;
}

export interface GenerateDocumentResult {
  success: boolean;
  documentId?: string;
  error?: string;
}
