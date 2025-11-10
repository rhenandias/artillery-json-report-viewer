import React, { useRef, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { CloudUpload } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

function FileUpload({ onFileUpload, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const syntheticEvent = {
        target: {
          files: event.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(syntheticEvent);
      event.dataTransfer.clearData();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="max-w-md w-full">
        <div
          className={`cursor-pointer block w-full bg-gray-800 border-2 border-dashed rounded-lg p-10 transition duration-300 ${
            isDragging
              ? "border-blue-500 bg-gray-700"
              : "border-gray-600 hover:border-blue-500 hover:bg-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center">
            <CloudUpload size={50} />

            <p className="text-xl font-semibold text-white">
              {isDragging ? "Drop to upload" : "Click to upload report"}
            </p>

            <p className="text-gray-400 mt-1">
              {isDragging ? "" : "Or drag and drop the JSON file here"}
            </p>
          </div>
        </div>

        <input
          ref={hiddenFileInput}
          type="file"
          className="hidden"
          accept=".json"
          onChange={onFileUpload}
        />

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
