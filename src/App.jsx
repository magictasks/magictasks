import React, { useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [appName, setAppName] = useState('')
  const [appDescription, setAppDescription] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [appLink, setAppLink] = useState('')
  const [error, setError] = useState('')

  const buildSteps = [
    { step: 'Initializing project...', duration: 2000 },
    { step: 'Setting up React environment...', duration: 3000 },
    { step: 'Configuring Vite build tools...', duration: 2500 },
    { step: 'Installing dependencies...', duration: 4000 },
    { step: 'Setting up authentication...', duration: 3500 },
    { step: 'Configuring Firebase backend...', duration: 3000 },
    { step: 'Creating API endpoints...', duration: 2500 },
    { step: 'Building user interface...', duration: 3500 },
    { step: 'Optimizing performance...', duration: 2000 },
    { step: 'Finalizing deployment...', duration: 3000 }
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
    if (!appName || !appDescription) return
    
    if (!isValidAppName(appName.trim())) {
      setError('App name must start with a lowercase letter or number, and contain only lowercase letters, numbers, and dashes.')
      return
    }

    setError('')
    setIsBuilding(true)
    setBuildProgress([])
    
    try {
      const response = await fetch(`${API_BASE_URL}/setup-and-initiate-loop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_name: appName.trim(),
          description: appDescription,
          images: uploadedImages,
          model_name: 'default-model',
          model_api: 'default-api'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create app')
        setIsBuilding(false)
        return
      }

      // Simulate build steps
      for (let i = 0; i < buildSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, buildSteps[i].duration))
        setBuildProgress(prev => [...prev, buildSteps[i].step])
      }

      setAppLink(data.link)
      setIsBuilding(false)
      setIsComplete(true)
    } catch (err) {
      console.error('Build error:', err)
      setError(`Error creating app: ${err.message}`)
      setIsBuilding(false)
    }
  }

  const handleReset = () => {
    setAppName('')
    setAppDescription('')
    setUploadedImages([])
    setIsBuilding(false)
    setBuildProgress([])
    setIsComplete(false)
    setAppLink('')
    setError('')
  }

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
        <h1 className="main-title">Magic App Builder</h1>
        <p className="subtitle">
          Build your dream app in seconds with AI-powered assistance
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
