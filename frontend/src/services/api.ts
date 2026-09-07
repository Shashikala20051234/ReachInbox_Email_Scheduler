const API_BASE_URL = 'http://localhost:5000/api'

export async function getEmailAccounts() {
  const response = await fetch(`${API_BASE_URL}/email-accounts`)

  if (!response.ok) {
    throw new Error(`Email accounts API failed: ${response.status}`)
  }

  return response.json()
}

export async function getCampaigns() {
  const response = await fetch(`${API_BASE_URL}/campaigns`)

  if (!response.ok) {
    throw new Error(`Campaigns API failed: ${response.status}`)
  }

  return response.json()
}

export async function getScheduledEmails() {
  const response = await fetch(`${API_BASE_URL}/scheduled-emails`)

  if (!response.ok) {
    throw new Error(`Scheduled emails API failed: ${response.status}`)
  }

  return response.json()
}