import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import { Button } from './components/ui/button';
import type { ArtilleryData } from './types';

function App() {
  const [reportData, setReportData] = useState<ArtilleryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const content = e.target?.result;

            if (typeof content === 'string') {
              const data = JSON.parse(content);

              // Basic validation to check if it looks like an Artillery report
              if (data.aggregate && data.intermediate) {
                setReportData(data);
                setError(null);
              } else {
                throw new Error(
                  'Invalid JSON file or not an Artillery report.',
                );
              }
            }
          } catch (err) {
            setError(
              'Failed to process the file. Ensure it is a valid Artillery JSON.',
            );
            setReportData(null);
            console.error(err);
          }
        };

        reader.onerror = () => {
          setError('Failed to read the file.');
          setReportData(null);
        };

        reader.readAsText(file);
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setReportData(null);
    setError(null);
    setFileName('');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300 p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Artillery JSON Report Viewer
        </h1>
      </header>

      <main className="grow flex flex-col justify-center">
        {!reportData && (
          <FileUpload onFileUpload={handleFileUpload} error={error} />
        )}

        {reportData && (
          <Dashboard
            data={reportData}
            fileName={fileName}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="w-full flex justify-center">
        <div className="text-center text-gray-500 mt-8 text-sm w-[50%] space-y-2">
          <p>
            This project is not affiliated with Artillery.io, and all brand
            rights are reserved to them.
          </p>
          <p>
            For a complete experience, consider subscribing to Artillery's
            services at
            <Button variant="link" asChild className="text-xs p-1 text-white">
              <a
                href="https://www.artillery.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.artillery.io/
              </a>
            </Button>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
