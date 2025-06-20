import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { getBaseApiConfig } from './config'
import { models, defaultModel } from './models'

function App() {
  const [appName, setAppName] = useState('')
  const [appDescription, setAppDescription] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [appLink, setAppLink] = useState('')
  const [error, setError] = useState('')

  // State for searchable model dropdown
  const [modelSearchTerm, setModelSearchTerm] = useState('')
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const animationTimeoutId = useRef(null)
  const progressLengthRef = useRef(0)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    // Cleanup timeout on component unmount
    const cleanup = () => {
        if(animationTimeoutId.current) {
            clearTimeout(animationTimeoutId.current)
        }
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      cleanup()
    }
  }, [dropdownRef])

  const buildSteps = [
    { step: 'Initializing project...', duration: 1500 },
    { step: 'Setting up React environment...', duration: 2000 },
    { step: 'Configuring Vite build tools...', duration: 1800 },
    { step: 'Installing dependencies...', duration: 3000 },
    { step: 'Setting up authentication...', duration: 2500 },
    { step: 'Configuring Firebase backend...', duration: 2200 },
    { step: 'Creating API endpoints...', duration: 2000 },
    { step: 'Building user interface...', duration: 2800 },
    { step: 'Optimizing performance...', duration: 1500 },
    { step: 'Finalizing deployment...', duration: 2000 }
  ]

  const isValidAppName = (name) => /^[a-z0-9]([-a-z0-9]{0,127})$/.test(name)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            name: file.name,
            data: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(imagePromises).then(images => {
      setUploadedImages(prev => [...prev, ...images])
    })
  }

  const handleBuildApp = async () => {
  console.log("Build app initiated.");
  
  if (!appName || !appDescription) {
    console.warn("App name or description missing.");
    return;
  }

  if (!isValidAppName(appName.trim())) {
    console.error("Invalid app name:", appName);
    setError('App name must start with a lowercase letter or number, and contain only lowercase letters, numbers, and dashes.');
    return;
  }

  console.log("Inputs validated successfully.");
  setError('');
  setIsBuilding(true);
  setBuildProgress([]);
  progressLengthRef.current = 0;

  const { baseUrl, body: baseBody } = getBaseApiConfig();
  console.log("API config determined:", { baseUrl, baseBody });

  const runAnimations = (stepIndex = 0) => {
    if (stepIndex >= buildSteps.length) {
      console.log("Animation sequence completed.");
      return;
    }
    const currentStep = buildSteps[stepIndex].step;
    console.log(`Animation step: ${currentStep}`);
    setBuildProgress(prev => [...prev, currentStep]);
    progressLengthRef.current = stepIndex + 1;
    animationTimeoutId.current = setTimeout(() => {
      runAnimations(stepIndex + 1);
    }, buildSteps[stepIndex].duration);
  };

  console.log("Starting animation sequence.");
  runAnimations();

  try {
    console.log("Sending request to backend:", `${baseUrl}/setup-and-initiate-loop`);

    const response = await fetch(`${baseUrl}/setup-and-initiate-loop`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...baseBody,
    app_name: appName.trim(),
    description: appDescription,
    images: uploadedImages,
    model_name: selectedModel,
    model_api: 'openrouter'
  })
});

console.log("Response status:", response.status, response.statusText);

if (!response.ok) {
  const errorData = await response.json();
  console.error("Error response:", errorData);
  setError(errorData.error || 'Failed to create app');
  setIsBuilding(false);
  return;
}

const data = await response.json();
console.log("Backend response data:", data);


    
    if (animationTimeoutId.current) clearTimeout(animationTimeoutId.current);
    console.log("Animation timeout cleared.");

    setBuildProgress(buildSteps.map(step => step.step));
    console.log("Build progress fully updated.");

    setAppLink(data.link);
    setIsComplete(true);
    console.log("App build completed successfully. App link set.");

  } catch (err) {
    console.error('Build error:', err);
    if (animationTimeoutId.current) clearTimeout(animationTimeoutId.current);
    setError(`Error creating app: ${err.message}`);
    setIsBuilding(false);
  }
};


  const handleReset = () => {
    setAppName('')
    setAppDescription('')
    setUploadedImages([])
    setSelectedModel(defaultModel)
    setIsBuilding(false)
    setBuildProgress([])
    setIsComplete(false)
    setAppLink('')
    setError('')
  }
  
  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  if (isComplete) {
    return (
      <div className="app-container">
        <div className="success-container">
          <div className="success-icon">✨</div>
          <h1 className="success-title">Your app is ready!</h1>
          <p className="success-subtitle">
            We've successfully created your app "{appName}"
          </p>
          <div className="success-actions">
            <a href={appLink} target="_blank" rel="noopener noreferrer" className="primary-button">
              View Your App
            </a>
            <button className="secondary-button" onClick={handleReset}>
              Build Another App
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="main-title">MagicTasks App Builder</h1>
        <p className="subtitle">
          Build a full stack app in seconds with AI-powered assistance.  Your app is free to create and download and will be live for 1 day.
        </p>
      </header>

      <div className={`builder-section ${isBuilding ? 'building' : ''}`}>
        {!isBuilding ? (
          <div className="builder-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="app-name">App Name</label>
                <input
                  id="app-name"
                  type="text"
                  placeholder="my-awesome-app"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value.toLowerCase())}
                  className="app-name-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="app-description">What would you like to build?</label>
              <textarea
                id="app-description"
                placeholder="Describe your app idea in detail..."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="app-description-input"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="model-select">AI Model</label>
              <div className="model-select-container" ref={dropdownRef}>
                <div 
                  className="model-select-display" 
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                >
                  <span>{models.find(m => m.id === selectedModel)?.name || 'Select a model'}</span>
                  <span className={`arrow ${isModelDropdownOpen ? 'up' : 'down'}`}>▼</span>
                </div>
                {isModelDropdownOpen && (
                  <div className="model-dropdown">
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={modelSearchTerm}
                      onChange={(e) => setModelSearchTerm(e.target.value)}
                      className="model-search-input"
                      autoFocus
                    />
                    <ul className="model-list">
                      {filteredModels.map(model => (
                        <li 
                          key={model.id} 
                          onClick={() => {
                            setSelectedModel(model.id);
                            setIsModelDropdownOpen(false);
                            setModelSearchTerm('');
                          }}
                          className={selectedModel === model.id ? 'selected' : ''}
                        >
                          {model.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image-upload">Upload Images (optional)</label>
              <div className="upload-area">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Click to upload or drag and drop</span>
                </label>
              </div>
              {uploadedImages.length > 0 && (
                <div className="uploaded-images">
                  {uploadedImages.map((img, idx) => (
                    <img key={idx} src={img.data} alt={`Upload ${idx + 1}`} className="uploaded-thumbnail" />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBuildApp}
              disabled={!appName || !appDescription}
              className="build-button"
            >
              Build My App
            </button>
          </div>
        ) : (
          <div className="building-container">
            <div className="building-header">
              <div className="spinner"></div>
              <h2>Building your app...</h2>
            </div>
            <div className="progress-list">
              {buildProgress.map((step, idx) => (
                <div key={idx} className="progress-item completed">
                  <span className="checkmark">✓</span>
                  <span>{step}</span>
                </div>
              ))}
              {buildSteps.slice(buildProgress.length).map((step, idx) => (
                <div key={idx + buildProgress.length} className="progress-item pending">
                  <span className="pending-icon">○</span>
                  <span>{step.step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
