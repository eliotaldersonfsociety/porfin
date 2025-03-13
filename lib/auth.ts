/**
 * Authentication helper functions
 */

export async function loginUser(email: string, password: string): Promise<void> {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to login")
    }
  
    return data
  }
  
  export async function getCurrentUser() {
    try {
      const response = await fetch("/api/user")
  
      if (!response.ok) {
        return null
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching current user:", error)
      return null
    }
  }
  
  export async function logoutUser() {
    const response = await fetch("/api/logout", {
      method: "POST",
    })
  
    if (!response.ok) {
      throw new Error("Failed to logout")
    }
  
    // Refresh the page to update UI
    window.location.reload()
  }
  
  