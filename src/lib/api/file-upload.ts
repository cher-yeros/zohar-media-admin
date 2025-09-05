/**
 * File upload utility for the Zohar Media API
 * Handles file uploads to the REST endpoint
 */

import { config } from "../config";

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileName?: string;
  error?: string;
}

export interface FileUploadOptions {
  folder: string;
  onProgress?: (progress: number) => void;
}

/**
 * Upload a file to the server
 * @param file - The file to upload
 * @param options - Upload options including folder and progress callback
 * @returns Promise with the upload response
 */
export const uploadFile = async (
  file: File,
  options: FileUploadOptions
): Promise<FileUploadResponse> => {
  const { folder, onProgress } = options;

  try {
    const formData = new FormData();
    formData.append("picture", file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve({
              success: false,
              message: "Invalid response from server",
              error: "Invalid JSON response",
            });
          }
        } else {
          resolve({
            success: false,
            message: `Upload failed with status ${xhr.status}`,
            error: xhr.statusText,
          });
        }
      });

      xhr.addEventListener("error", () => {
        resolve({
          success: false,
          message: "Network error during upload",
          error: "Network error",
        });
      });

      xhr.addEventListener("abort", () => {
        resolve({
          success: false,
          message: "Upload was cancelled",
          error: "Upload cancelled",
        });
      });

      xhr.open("POST", `${config.apiBaseUrl}/api/upload-file/${folder}`);

      // Add authorization header if token exists
      const token = localStorage.getItem("auth-token");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  } catch (error) {
    return {
      success: false,
      message: "Failed to prepare file for upload",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Upload multiple files in sequence
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Promise with array of upload responses
 */
export const uploadMultipleFiles = async (
  files: File[],
  options: FileUploadOptions
): Promise<FileUploadResponse[]> => {
  const results: FileUploadResponse[] = [];

  for (const file of files) {
    const result = await uploadFile(file, options);
    results.push(result);
  }

  return results;
};

/**
 * Upload multiple files in parallel
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Promise with array of upload responses
 */
export const uploadMultipleFilesParallel = async (
  files: File[],
  options: FileUploadOptions
): Promise<FileUploadResponse[]> => {
  const uploadPromises = files.map((file) => uploadFile(file, options));
  return Promise.all(uploadPromises);
};

/**
 * Validate file before upload
 * @param file - File to validate
 * @param maxSize - Maximum file size in bytes
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
  ]
): { valid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * Get file size in human readable format
 * @param bytes - File size in bytes
 * @returns Human readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Get file dimensions for images
 * @param file - Image file
 * @returns Promise with image dimensions
 */
export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

/**
 * Get video duration
 * @param file - Video file
 * @returns Promise with video duration in seconds
 */
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };

    video.src = url;
  });
};
