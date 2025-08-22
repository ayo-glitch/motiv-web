import axios from "axios";

const upload = async (file: File): Promise<string> => {
  console.log("Starting Cloudinary upload for:", file.name, "Size:", file.size);
  
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkuphcizs/image/upload",
      data,
      {
        timeout: 30000, // 30 seconds timeout
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      }
    );
    
    console.log("Cloudinary response:", res.data);
    const { url } = res.data;
    
    if (!url) {
      throw new Error("No URL returned from Cloudinary");
    }
    
    console.log("Upload successful, URL:", url);
    return url;
  } catch (err: any) {
    console.error("Upload error:", err);
    
    if (err.code === 'ECONNABORTED') {
      throw new Error("Upload timeout - please try again");
    } else if (err.response) {
      console.error("Cloudinary error response:", err.response.data);
      throw new Error(`Upload failed: ${err.response.data?.error?.message || 'Unknown error'}`);
    } else if (err.request) {
      throw new Error("Network error - please check your connection");
    } else {
      throw new Error("Failed to upload image");
    }
  }
};

export default upload;
