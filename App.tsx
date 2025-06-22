import React, { useState, useCallback, useEffect } from 'react';
import { RecordingsManager } from './components/RecordingsManager';
import { TranscriptView } from './components/TranscriptView';
import { GeminiChat } from './components/GeminiChat';
import type { Recording, ChatMessage } from './types';
import { InfoIcon, BrandIcon } from './components/Icons'; // Assuming BrandIcon is a generic app icon

const App: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // API_KEY is expected to be set in the environment
    const key = process.env.API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
    }
  }, []);

  const handleAddRecording = useCallback((recording: Recording) => {
    setRecordings(prev => [recording, ...prev]);
    setSelectedRecording(recording); // Auto-select the new recording
  }, []);

  const handleSelectRecording = useCallback((recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    setSelectedRecording(recording || null);
  }, [recordings]);

  const handleUpdateRecordingTranscript = useCallback((recordingId: string, newTranscript: string) => {
    setRecordings(prev => prev.map(r => r.id === recordingId ? { ...r, transcript: newTranscript } : r));
    if (selectedRecording && selectedRecording.id === recordingId) {
      setSelectedRecording(prev => prev ? { ...prev, transcript: newTranscript } : null);
    }
  }, [selectedRecording]);
  
  const handleUpdateRecordingChatHistory = useCallback((recordingId: string, newChatHistory: ChatMessage[]) => {
    setRecordings(prev => 
      prev.map(r => r.id === recordingId ? { ...r, chatHistory: newChatHistory } : r)
    );
    if (selectedRecording && selectedRecording.id === recordingId) {
      setSelectedRecording(prev => prev ? { ...prev, chatHistory: newChatHistory } : null);
    }
  }, [selectedRecording]);


  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-center">
          <BrandIcon className="w-24 h-24 mx-auto mb-6 text-sky-500" />
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Voice Memo AI Assistant</h1>
          <p className="text-red-400 text-lg mb-2">Configuration Error</p>
          <p className="text-slate-300">
            The Gemini API Key (API_KEY) is not configured. Please ensure the API_KEY environment variable is set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <header className="bg-slate-800 p-4 shadow-md flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <BrandIcon className="w-8 h-8 text-sky-500" />
          <h1 className="text-2xl font-bold text-slate-100">Voice Memo AI Assistant</h1>
        </div>
        <a 
          href="https://ai.google.dev/docs/gemini_api_overview" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          Powered by Gemini
        </a>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 min-w-[350px] max-w-[450px] bg-slate-800 p-4 overflow-y-auto border-r border-slate-700">
          <RecordingsManager 
            apiKey={apiKey}
            onAddRecording={handleAddRecording} 
            recordings={recordings}
            selectedRecordingId={selectedRecording?.id || null}
            onSelectRecording={handleSelectRecording}
            onUpdateTranscript={handleUpdateRecordingTranscript}
          />
        </aside>
        
        <main className="flex-1 p-6 overflow-y-auto bg-slate-850 flex flex-col"> {/* Added bg-slate-850 for subtle contrast */}
          {selectedRecording ? (
            <div className="space-y-6 flex flex-col flex-grow">
              <TranscriptView recording={selectedRecording} />
              <div className="flex-grow flex flex-col min-h-0">
                 <GeminiChat 
                    apiKey={apiKey}
                    recording={selectedRecording} 
                    onChatHistoryChange={(newHistory) => handleUpdateRecordingChatHistory(selectedRecording.id, newHistory)}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <InfoIcon className="w-16 h-16 mb-4" />
              <p className="text-xl">Select a recording to view its transcript and chat with AI.</p>
              <p className="mt-2 text-sm">Or, create a new recording using the controls on the left.</p>
            </div>
          )}
        </main>
      </div>
       <footer className="bg-slate-800 p-3 text-center text-xs text-slate-400 border-t border-slate-700">
        Note: Automatic Google Drive upload is not implemented due to client-side limitations. Please use the download buttons for your recordings and transcripts.
      </footer>
    </div>
  );
};

export default App;
