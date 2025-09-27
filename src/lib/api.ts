import { ApiResponse } from "@/types";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export async function callApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function fetchData<T>(
  sheetName: string
): Promise<ApiResponse<T[]>> {
  return callApi<T[]>(`${GAS_URL}?sheet=${sheetName}`);
}

export async function addData<T>(
  sheetName: string,
  payload: Partial<T>
): Promise<ApiResponse<T>> {
  return callApi<T>(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "POST",
      sheet: sheetName,
      payload,
    }),
  });
}

export async function updateData<T>(
  sheetName: string,
  payload: T
): Promise<ApiResponse<T>> {
  return callApi<T>(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "PUT",
      sheet: sheetName,
      payload,
    }),
  });
}

export async function deleteData(
  sheetName: string,
  id: string
): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
  return callApi(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "DELETE",
      sheet: sheetName,
      payload: { id },
    }),
  });
}

export async function uploadImage(
  base64Data: string,
  fileName: string,
  folderId?: string
): Promise<ApiResponse<{ id: string; url: string; webViewLink: string }>> {
  return callApi(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "upload",
      base64Data,
      fileName,
      folderId,
    }),
  });
}
