// app/tts/page.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { databases, DATABASE_ID, Query } from '../../appwriteConfig';
import { FiDownload } from 'react-icons/fi';

const USER_MODELS_COLLECTION_ID = '67ec6079001106cf0e5a';
const BROWSE_MODELS_COLLECTION_ID = '67ec690d00222d6243c6'; // Replace with your collection ID
const MAX_CHARS = 3000;
const BACKEND_URL = process.env.NEXT_PUBLIC_TTS_API || 'http://localhost:8000/generate-tts/';

const MyModelsTabContent = ({ onSelectModel }) => {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getModels = async () => {
      if (!user) {
        setError('Sign in to view your models.');
        setLoading(false);
        return;
      }
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          USER_MODELS_COLLECTION_ID,
          [Query.equal('user_email', user.email)]
        );
        setModels(response.documents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch models.');
        setLoading(false);
      }
    };
    getModels();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {models.map((modelItem) => (
        <div key={modelItem.model_id} className="flex items-center justify-between p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-4">
            <img 
              src={modelItem.cover_image} 
              alt={modelItem.title}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{modelItem.title}</h3>
              <p className="text-sm text-gray-500">ID: {modelItem.model_id}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectModel(modelItem)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use Model
          </button>
        </div>
      ))}
    </div>
  );
};

const BrowseModelsTabContent = ({ onSelectModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getModels = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          BROWSE_MODELS_COLLECTION_ID,
          [Query.orderDesc('$createdAt')]
        );
        setModels(response.documents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch public models.');
        setLoading(false);
      }
    };
    getModels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {models.map((modelItem) => (
        <div key={modelItem.fish_model_id} className="flex items-center justify-between p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-4">
            <img 
              src={modelItem.image_url} 
              alt={modelItem.title}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{modelItem.title}</h3>
              <p className="text-sm text-gray-500">ID: {modelItem.fish_model_id}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectModel(modelItem)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use Model
          </button>
        </div>
      ))}
    </div>
  );
};

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioList, setAudioList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [model, setModel] = useState(null);
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { user, charRemaining, setCharRemaining } = useAuth();

  const handleConvert = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, MAX_CHARS),
          model: model ? (model.model_id || model.fish_model_id) : 'default'
        })
      });

      if (!response.ok) throw new Error('Error generating speech');

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);

      setAudioList(prev => [{
        id: Date.now(),
        url: newAudioUrl,
        timestamp: new Date().toLocaleString()
      }, ...prev]);

      setSuccessMessage('Speech generated successfully!');
    } catch (error) {
      setErrorMessage('Failed to connect to the backend. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">High Quality Text to Speech Converter</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Text Input Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Enter Text</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter text to convert..."
              />
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => setText('')}
                  disabled={!text}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear
                </button>
                <span className={`text-sm ${text.length >= MAX_CHARS ? 'text-red-600' : 'text-gray-500'}`}>
                  {text.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Model Selection</h2>
              {model ? (
                <div className="flex items-center justify-between p-3 border rounded-lg h-14">
                  <div className="flex items-center space-x-3">
                    <img
                      src={model.cover_image || model.image_url}
                      alt={model.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{model.title}</span>
                  </div>
                  <button
                    onClick={() => setModel(null)}
                    className="text-red-600 text-2xl hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModelDialogOpen(true)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 h-14"
                >
                  <span>Select Model</span>
                </button>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleConvert}
              disabled={loading || !text}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Speech'}
            </button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="mt-4 p-4 text-red-800 bg-red-50 rounded-lg">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-4 text-green-800 bg-green-50 rounded-lg">
              {successMessage}
            </div>
          )}
        </div>

        {/* Right Section - Audio History */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-center">Audio History</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {audioList.map((audio) => (
              <div key={audio.id} className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500 mb-2">{audio.timestamp}</p>
                <audio controls className="w-full mb-3">
                  <source src={audio.url} type="audio/mpeg" />
                </audio>
                <div className="flex gap-3 justify-center">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Save
                  </button>
                  <a
                    href={audio.url}
                    download="speech.mp3"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FiDownload /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Selection Modal */}
      {isModelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Select pre trained models</h3>
            </div>
            
            <div className="p-4">
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setTabValue(0)}
                  className={`px-4 py-2 ${tabValue === 0 ? 'border-b-2 border-blue-600' : ''}`}
                >
                  My Models
                </button>
                <button
                  onClick={() => setTabValue(1)}
                  className={`px-4 py-2 ${tabValue === 1 ? 'border-b-2 border-blue-600' : ''}`}
                >
                  Browse Models
                </button>
              </div>

              {tabValue === 0 && <MyModelsTabContent onSelectModel={(model) => {
                setModel(model);
                setIsModelDialogOpen(false);
              }} />}

              {tabValue === 1 && <BrowseModelsTabContent onSelectModel={(model) => {
                setModel(model);
                setIsModelDialogOpen(false);
              }} />}
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsModelDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
