import React, { useState } from 'react'
import { FileText, Headphones, Loader, AlertCircle } from 'lucide-react'
import FileUpload from './components/FileUpload'
import AudioPlayer from './components/AudioPlayer'
import { extractTextFromFile } from './utils/textExtraction'
import { textToSpeech } from './utils/groqApi'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile)
    setAudioUrl(null)
    setExtractedText(null)
    setError(null)
    setStatus('Extracting text...')
    
    try {
      const text = await extractTextFromFile(uploadedFile)
      setExtractedText(text)
      setStatus('Text extracted successfully')
    } catch (error) {
      console.error('Error extracting text:', error)
      setError('Failed to extract text from the file. Please try again with a supported file type (PDF, DOCX, or TXT).')
      setStatus(null)
    }
  }

  const handleConvert = async () => {
    if (!extractedText) return

    setLoading(true)
    setError(null)
    setStatus('Converting text to speech...')
    try {
      const audioUrl = await textToSpeech(extractedText)
      setAudioUrl(audioUrl)
      setStatus('Conversion complete')
    } catch (error) {
      console.error('Error converting file:', error)
      setError('Failed to convert text to speech. Please check your internet connection and try again.')
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">PDF to Podcast Converter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <FileUpload onFileUpload={handleFileUpload} />
        {file && (
          <div className="mt-4">
            <p className="flex items-center">
              <FileText className="mr-2" size={20} />
              {file.name}
            </p>
            {extractedText && (
              <div className="mt-2 p-2 bg-gray-100 rounded max-h-40 overflow-y-auto">
                <p className="text-sm">{extractedText.slice(0, 200)}...</p>
              </div>
            )}
            <button
              onClick={handleConvert}
              disabled={loading || !extractedText}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full flex items-center justify-center disabled:bg-gray-400"
            >
              {loading ? (
                <Loader className="animate-spin mr-2" size={20} />
              ) : (
                <Headphones className="mr-2" size={20} />
              )}
              {loading ? 'Converting...' : 'Convert to Audio'}
            </button>
          </div>
        )}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
        {status && <p className="mt-4 text-green-500">{status}</p>}
        {error && (
          <p className="mt-4 text-red-500 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default App