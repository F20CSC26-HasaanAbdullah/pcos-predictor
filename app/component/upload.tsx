"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [gradcam, setGradcam] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setConfidence(null);
      setGradcam(null);
      updatePreview(e.target.files[0]);
    }
  };

  const updatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
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
        setResult(`Prediction: ${data.label}`);
        setConfidence(`Confidence: ${(data.confidence * 100).toFixed(2)}%`);
        setGradcam(`data:image/jpeg;base64,${data.gradcam}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('Error uploading file');
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <div className="header">
          <h1>PCOS Detection from Ultrasound Images</h1>
        </div>
        <div className="upload-area" id="upload-form" onClick={() => document.getElementById('file-input')?.click()}>
          <Image src="/static/upload.png" className="upload-icon" alt="Upload Icon" width={50} height={50} />
          Drag files here to upload or click to select files
          <input type="file" id="file-input" name="file" accept="image/*" required hidden onChange={handleFileChange} />
          <div id="file-name" className="file-name">{file ? `File: ${file.name}` : ''}</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>PREDICT</button>
        <div className="preview-container">
          {preview && <Image id="image-preview" className="preview" src={preview} alt="Image Preview" width={200} height={200} />}
          {gradcam && <Image id="gradcam-preview" className="preview" src={gradcam} alt="Grad-CAM Preview" width={200} height={200} style={{ marginLeft: '20px' }} />}
        </div>
        {result && <div id="result" className="result">{result}</div>}
        {confidence && <div id="confidence" className="confidence">{confidence}</div>}
      </div>
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
        }
        .main-container {
          background: url('/static/Background1.png') no-repeat center center fixed;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
        }
        .container {
          background: rgba(255, 255, 255, 0.5);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          backdrop-filter: blur(10px);
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
          margin-bottom: 10px;
        }
        .btn-primary {
          background-color: #b2245d;
          border-color: #b2245d;
          color: white;
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
        .confidence {
          margin-top: 10px;
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
