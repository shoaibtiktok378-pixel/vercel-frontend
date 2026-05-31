import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [serverInfo, setServerInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [echoMessage, setEchoMessage] = useState('');
  const [echoResult, setEchoResult] = useState(null);
  const [uploadData, setUploadData] = useState({ name: '', email: '' });
  const [uploadResult, setUploadResult] = useState(null);
  const [deployStatus, setDeployStatus] = useState(null);

  // Your backend URL
  const BASE_URL = 'https://www.zohaibahmadali.software';

  // Fetch server info on component mount
  useEffect(() => {
    fetchServerInfo();
    fetchHealth();
    fetchDeployStatus();
  }, []);

  const fetchServerInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/info`);
      setServerInfo(response.data);
    } catch (err) {
      setError('Failed to fetch server info');
      console.error(err);
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/health`);
      setHealth(response.data);
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  const fetchDeployStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/deploy-status`);
      setDeployStatus(response.data);
    } catch (err) {
      console.error('Failed to fetch deploy status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEcho = async (e) => {
    e.preventDefault();
    if (!echoMessage) return;
    
    try {
      const response = await axios.get(`${BASE_URL}/api/echo/${echoMessage}`);
      setEchoResult(response.data);
    } catch (err) {
      setEchoResult({ error: 'Failed to echo message' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/upload`, uploadData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUploadResult(response.data);
    } catch (err) {
      setUploadResult({ error: 'Upload failed' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Connecting to backend...</h2>
          <p className="text-gray-500 mt-2">{BASE_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🚀 Backend Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Connected to: <code className="bg-gray-200 px-2 py-1 rounded">{BASE_URL}</code>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Server Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">📡</span> Server Information
          </h2>
          {serverInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Server</p>
                <p className="font-semibold text-gray-800">{serverInfo.server}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-semibold text-gray-800">{serverInfo.version}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Node Version</p>
                <p className="font-semibold text-gray-800">{serverInfo.nodeVersion}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Platform</p>
                <p className="font-semibold text-gray-800">{serverInfo.platform}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="font-semibold text-gray-800">{new Date(serverInfo.currentTime).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Health Check Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">💚</span> Health Status
          </h2>
          {health && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Status</span>
                <span className={`font-bold px-3 py-1 rounded-full ${health.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {health.status}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Uptime</span>
                <span className="font-semibold text-gray-800">{Math.floor(health.uptime)} seconds</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Timestamp</span>
                <span className="font-semibold text-gray-800">{new Date(health.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Echo Endpoint */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">🗣️</span> Echo Test
          </h2>
          <form onSubmit={handleEcho} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter a message to echo..."
                value={echoMessage}
                onChange={(e) => setEchoMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Send Echo
            </button>
          </form>
          {echoResult && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-gray-700">Response:</p>
              <p className="text-gray-800 mt-1">{echoResult.message || echoResult.error}</p>
            </div>
          )}
        </div>

        {/* Upload Endpoint */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">📤</span> Upload Data
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={uploadData.email}
                onChange={(e) => setUploadData({ ...uploadData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Upload Data
            </button>
          </form>
          {uploadResult && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="font-semibold text-gray-700 mb-2">Upload Response:</p>
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Deployment Status Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">🚀</span> CI/CD Deployment Status
          </h2>
          {deployStatus && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="font-semibold text-gray-800">{deployStatus.deployment?.version}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Environment</p>
                  <p className="font-semibold text-gray-800">{deployStatus.deployment?.environment}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Platform</p>
                  <p className="font-semibold text-gray-800">{deployStatus.deployment?.platform?.platformName}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Git Branch</p>
                  <p className="font-semibold text-gray-800">{deployStatus.git?.branch || 'N/A'}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Last Commit</p>
                  <p className="font-semibold text-gray-800">{deployStatus.git?.shortHash || 'N/A'}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Pipeline Status</p>
                  <p className="font-semibold text-green-600 flex items-center">
                    <span className="text-xl mr-1">✅</span> {deployStatus.pipeline?.status}
                  </p>
                </div>
              </div>
              {deployStatus.git?.lastCommitMessage && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Commit Message</p>
                  <p className="font-semibold text-gray-800">{deployStatus.git.lastCommitMessage}</p>
                </div>
              )}
              {deployStatus.deployment?.deployedAt && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Deployed At</p>
                  <p className="font-semibold text-gray-800">{new Date(deployStatus.deployment.deployedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Backend Dashboard • Connected to {BASE_URL}</p>
        </div>
      </div>
    </div>
  );
};

export default App;