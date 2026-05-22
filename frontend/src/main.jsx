// Add this before createRoot line
import { Toaster } from 'react-hot-toast'
// Install first: npm install react-hot-toast

// Wrap App with Toaster:
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  </StrictMode>,
)