"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gradcam, setGradcam] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      updatePreview(e.target.files[0]);
    }
  };

  const updatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('image-preview') as HTMLImageElement;
      img.src = reader.result as string;
      img.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5008/upload', formData);
      const data = response.data;
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(`Prediction: ${data.label}, Confidence: ${(data.confidence * 100).toFixed(2)}%`);
        setGradcam(`data:image/jpeg;base64,${data.gradcam}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('Error uploading file');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>PCOS Detection from Ultrasound Images</h1>
      </div>
      <div className="upload-area" id="upload-form" onClick={() => document.getElementById('file-input')?.click()}>
        <img src="/static/upload.png" className="upload-icon" alt="Upload Icon" />
        Drag files here to upload or click to select files
        <input type="file" id="file-input" name="file" accept="image/*" required hidden onChange={handleFileChange} />
        <div id="file-name" className="file-name">{file ? `File: ${file.name}` : ''}</div>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>PREDICT</button>
      <div className="preview-container">
        <img id="image-preview" className="preview" src="" alt="Image Preview" style={{ display: 'none' }} />
        {gradcam && <img id="gradcam-preview" className="preview" src={gradcam} alt="Grad-CAM Preview" />}
      </div>
      {result && <div id="result" className="result">{result}</div>}
      <style jsx>{`
        .container {
          background: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          backdrop-filter: blur(10px);
          margin: 20px;
        }
        .header {
          background-color: #e15699;
          color: #ffffff;
          padding: 10px 0;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 1.6rem;
          font-weight: semibold;
        }
        .upload-area {
          border: 2px dashed #ccc;
          width: 50%;
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #333;
          font-size: 16px;
          margin: 20px auto;
          background-color: #f8f9fa;
        }
        .upload-area.hover {
          border-color: #e15699;
          color: #000;
        }
        .upload-icon {
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }
        .btn-primary {
          background-color: #b2245d;
          border-color: #b2245d;
          width: 50%;
          margin: 0 auto;
          display: block;
          transition: background-color 0.3s;
        }
        .btn-primary:hover {
          background-color: #000;
        }
        .preview-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .preview {
          max-width: 45%;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          margin-right: 10px;
        }
        .result {
          margin-top: 20px;
          font-size: 1.2em;
          font-weight: bold;
        }
        .file-name {
          font-size: 14px;
          color: #333;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Upload;
