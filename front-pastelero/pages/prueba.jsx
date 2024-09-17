import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function UploadForm() {
  const { register, handleSubmit, watch } = useForm();
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Obtener los archivos seleccionados
  const file1 = watch("file1");
  const file2 = watch("file2");

  // Función para previsualizar imágenes
  const handlePreview = (file, setPreview) => {
    if (file && file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file[0]);
    } else {
      setPreview(null);
    }
  };

  // Actualizar la vista previa cuando cambian los archivos seleccionados
  useEffect(() => {
    if (file1) handlePreview(file1, setPreview1);
    if (file2) handlePreview(file2, setPreview2);
  }, [file1, file2]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file1", data.file1[0]);
    if (data.file2) formData.append("file2", data.file2[0]);

    const res = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setUploadStatus("Upload successful!");
    } else {
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Image 1</label>
          <input type="file" {...register("file1")} accept="image/*" required />
          {preview1 && (
            <Image
              src={preview1}
              width={500}
              height={500}
              alt="Preview 1"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <div>
          <label>Image 2 (optional)</label>
          <input type="file" {...register("file2")} accept="image/*" />
          {preview2 && (
            <Image
              width={500}
              height={500}
              src={preview2}
              alt="Preview 2"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
