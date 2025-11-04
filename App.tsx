import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import Spinner from './components/Spinner';
import { ImageIcon } from './components/icons/ImageIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ErrorIcon } from './components/icons/ErrorIcon';

// Fix: Changed return type from JSX.Element to React.ReactElement to resolve namespace issue.
export default function App(): React.ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block bg-indigo-500/10 p-2 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
            AI Image Generator
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Describe any image you can imagine, and let our AI bring it to life in stunning detail.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                  Your creative prompt
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A majestic lion wearing a crown, cinematic lighting, hyperrealistic"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 placeholder-slate-500"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="aspect-square bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <Spinner size="lg" />
                <p className="mt-4 text-lg">Brewing your masterpiece...</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center text-red-400 p-4 text-center">
                <ErrorIcon className="w-16 h-16 mb-4"/>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            {!isLoading && !error && generatedImage && (
              <img
                src={generatedImage}
                alt="AI generated"
                className="w-full h-full object-contain transition-opacity duration-700 opacity-0 animate-fade-in"
                style={{ animationFillMode: 'forwards' }}
              />
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="flex flex-col items-center justify-center text-slate-500">
                <ImageIcon className="w-24 h-24 mb-4" />
                <p className="text-lg font-medium">Your image will appear here</p>
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-in-out;
        }
      `}</style>
    </div>
  );
}