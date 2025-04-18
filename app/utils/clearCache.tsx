"use client"

import Cookies from 'js-cookie'

export function clearAuthCache() {
  // Clear localStorage
  localStorage.removeItem("user")
  
  // Clear cookies
  Cookies.remove("user", { path: '/' })
  
  // Reload the page to apply changes
  window.location.href = "/"
}

// Export a component that can be used in pages
export default function ClearCacheButton() {
  return (
    <button 
      onClick={clearAuthCache}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Clear Auth Cache
    </button>
  )
} 