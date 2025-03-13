// API utility functions for interacting with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred while processing your request",
    }))
    throw new Error(error.message || "An error occurred")
  }
  return response.json()
}

// Authentication functions
export async function login(email: string, password: string, recaptchaToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, recaptchaToken }),
  })

  return handleResponse(response)
}

export async function register(userData: {
  name: string
  lastname: string
  email: string
  password: string
  direction: string
  postalcode: string
  recaptchaToken: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  return handleResponse(response)
}

// User balance functions
export async function getUserBalance() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/user/saldo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function updateUserBalance(amount: number) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/user/saldo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  })

  return handleResponse(response)
}

// Purchase functions
export async function getUserPurchases() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/purchases`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function savePurchase(purchaseData: {
  items: any[]
  payment_method: string
  total_amount: number
}) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/user/compras`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseData),
  })

  return handleResponse(response)
}

export async function updateBalanceAfterPurchase(userId: number, total_amount: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/user/actualizar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, total_amount }),
  })

  return handleResponse(response)
}

// Admin functions
export async function getAllUsers() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/user/recargar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function updateUserBalanceByAdmin(email: string, saldo: number) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/v1/user/updateSaldo`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, saldo }),
  })

  return handleResponse(response)
}

