import React, { useState } from 'react'
import './App.css'

function App() {
  const [appName, setAppName] = useState('')
  const [appDescription, setAppDescription] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState([])
  const [isComplete, setIsComplete] = useState(false)

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(imagePromises).then(images => {
      setUploadedImages(prev => [...prev, ...images])
    })
  }

  const handleBuildApp = async () => {
    if (!appName || !appDescription) return
    
    setIsBuilding(true)
    setBuildProgress([])
    
    for (let i = 0; i < buildSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, buildSteps[i].duration))
      setBuildProgress(prev => [...prev, buildSteps[i].step])
    }
    
    setIsBuilding(false)
    setIsComplete(true)
  }

  const handleReset = () => {
    setAppName('')
    setAppDescription('')
    setUploadedImages([])
    setIsBuilding(false)
    setBuildProgress([])
    setIsComplete(false)
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
            <button className="primary-button">
              View Your App
            </button>
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
          Your AI Powered Assistant for Apps, designed to assist in performing tasks
          when you're thinking big but not sure where to start. Connect directly through its simplicity, 
          efficiency and improving patient care across various medical fields.
        </p>
        {!isBuilding && (
          <button className="get-started-button" onClick={() => document.getElementById('app-name').focus()}>
            Get Started
          </button>
        )}
      </header>

      <div className={`builder-section ${isBuilding ? 'building' : ''}`}>
        {!isBuilding ? (
          <div className="builder-form">
            <div className="form-group">
              <label htmlFor="app-name">App Name</label>
              <input
                id="app-name"
                type="text"
                placeholder="Enter your app name..."
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="app-name-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="app-description">What would you like to build?</label>
              <textarea
                id="app-description"
                placeholder="Describe your app idea in detail. What features do you need? Who are your users? What problems does it solve?..."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                className="app-description-input"
                rows="6"
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
                  <span>Click to upload images or drag and drop</span>
                </label>
              </div>
              {uploadedImages.length > 0 && (
                <div className="uploaded-images">
                  {uploadedImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Upload ${idx + 1}`} className="uploaded-thumbnail" />
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

      <footer className="footer">
        <div className="trust-badges">
          <span className="badge">Data Security and Compliance</span>
          <span className="badge">AI-Powered Technology</span>
          <span className="badge">Instant Deployment</span>
        </div>
      </footer>
    </div>
  )
}

export default App
