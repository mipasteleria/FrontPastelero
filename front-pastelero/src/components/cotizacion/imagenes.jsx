import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function UploadFormImage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage(["Por favor, selecciona dos imagenes"]);
      return;
    }

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
      formData.append("fileOutputName", selectedFiles[i].name);
    }

    try {
      // Enviar los archivos al backend
      const uploadResponse = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(["Files uploaded successfully!"]);

      // Aquí puedes actualizar las URLs si tu backend devuelve URLs
      // const filenames = Array.from(selectedFiles).map(file => file.name);
      // const urls = await Promise.all(filenames.map(filename => axios.get(`/api/image-url/${filename}`)));
      // setImageUrls(urls.map(url => url.data.url));
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage(["Error uploading files. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message.length > 0 &&
        message.map((msg, index) => <p key={index}>{msg}</p>)}
      {imageUrls.length > 0 &&
        imageUrls.map((url, index) => (
          <div key={index}>
            <h2>Uploaded Image:</h2>
            <Image
              src={url}
              alt={`Uploaded image ${index}`}
              width={500}
              height={500}
              style={{ maxWidth: "100%" }}
            />
          </div>
        ))}
    </div>
  );
}
