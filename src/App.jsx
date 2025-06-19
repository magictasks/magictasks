import React, { useState } from 'react'
// Import Firebase services from firebase.js
import { auth, db, storage, functions } from './firebase'
import { signInAnonymously } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'

function FirebaseTest() {
  const [authStatus, setAuthStatus] = useState('')
  const [dbStatus, setDbStatus] = useState('')
  const [storageStatus, setStorageStatus] = useState('')
  const [functionsStatus, setFunctionsStatus] = useState('')

  const testAuth = async () => {
    try {
      await signInAnonymously(auth)
      setAuthStatus('✅ Auth: Signed in anonymously')
    } catch (e) {
      setAuthStatus('❌ Auth error: ' + e.message)
    }
  }

  const testDb = async () => {
    try {
      const testRef = doc(db, 'test', 'testDoc')
      await setDoc(testRef, { hello: 'world', ts: Date.now() })
      const snap = await getDoc(testRef)
      setDbStatus('✅ Firestore: ' + JSON.stringify(snap.data()))
    } catch (e) {
      setDbStatus('❌ Firestore error: ' + e.message)
    }
  }

  const testStorage = async () => {
    try {
      const testRef = ref(storage, 'test/test.txt')
      await uploadString(testRef, 'Hello Storage!')
      const url = await getDownloadURL(testRef)
      setStorageStatus('✅ Storage: File uploaded. URL: ' + url)
    } catch (e) {
      setStorageStatus('❌ Storage error: ' + e.message)
    }
  }

  const testFunctions = async () => {
    try {
      // Replace 'helloWorld' with your function name if different
      const helloWorld = httpsCallable(functions, 'helloWorld')
      const result = await helloWorld()
      setFunctionsStatus('✅ Functions: ' + JSON.stringify(result.data))
    } catch (e) {
      setFunctionsStatus('❌ Functions error: ' + e.message)
    }
  }

  return (
    <div style={{ margin: '2em 0', padding: '1em', border: '1px solid #ccc' }}>
      <h2>Firebase Emulator Test</h2>
      <button onClick={testAuth}>Test Auth</button>
      <div>{authStatus}</div>
      <button onClick={testDb}>Test Firestore</button>
      <div>{dbStatus}</div>
      <button onClick={testStorage}>Test Storage</button>
      <div style={{ wordBreak: 'break-all' }}>{storageStatus}</div>
      <button onClick={testFunctions}>Test Functions</button>
      <div>{functionsStatus}</div>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <h1>Firebase Emulator UI Test</h1>
      <FirebaseTest />
    </div>
  )
}