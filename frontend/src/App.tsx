import { useEffect, useState } from 'react'
import './App.css'
import {
  getEmailAccounts,
  getCampaigns,
  getScheduledEmails,
} from './services/api'

type Page =
  | 'login'
  | 'schedule'
  | 'activity'
  | 'details'
  | 'compose'
  | 'profile'

type Email = {
  id: number
  recipient: string
  subject: string
  body: string
  scheduledAt: string
  sentAt: string | null
  status: string
  errorMessage?: string | null
}

type EmailAccount = {
  id: number
  email: string
  displayName: string
}

function App() {
  const [page, setPage] = useState<Page>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([])

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  // Load real backend data
  useEffect(() => {
    if (page === 'login') return

    async function loadData() {
      try {
        setLoading(true)
        setApiError('')

        const [accounts, campaignData, emails] = await Promise.all([
          getEmailAccounts(),
          getCampaigns(),
          getScheduledEmails(),
        ])

        setEmailAccounts(
          Array.isArray(accounts)
            ? accounts
            : accounts.value || []
        )

        setCampaigns(
          Array.isArray(campaignData)
            ? campaignData
            : campaignData.value || []
        )

        setScheduledEmails(
          Array.isArray(emails)
            ? emails
            : emails.value || []
        )
      } catch (error) {
        console.error(error)
        setApiError(
          'Unable to load data from the backend.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [page])

  const sentEmails = scheduledEmails.filter(
    (item) => item.status === 'SENT'
  )

  const pendingEmails = scheduledEmails.filter(
    (item) => item.status === 'PENDING'
  )

  // LOGIN PAGE
  if (page === 'login') {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="brand">
            <div className="brand-icon">R</div>
            <h1>ReachInbox</h1>
          </div>

          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Sign in to manage your email campaigns
          </p>

          <button
            className="google-btn"
            onClick={() => setPage('schedule')}
          >
            <span>G</span>
            Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-btn"
            onClick={() => setPage('schedule')}
          >
            Login
          </button>

        </div>
      </div>
    )
  }

  // MAIN NAVIGATION
  const Navigation = () => (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">R</div>
        <strong>ReachInbox</strong>
      </div>

      <button
        className="compose-side-btn"
        onClick={() => setPage('compose')}
      >
        ✎ Compose
      </button>

      <nav>

        <button
          className={page === 'schedule' ? 'nav-active' : ''}
          onClick={() => setPage('schedule')}
        >
          ✉ Schedule & Send
        </button>

        <button
          className={page === 'activity' ? 'nav-active' : ''}
          onClick={() => setPage('activity')}
        >
          ✓ Sent
        </button>

        <button
          className={page === 'activity' ? 'nav-active' : ''}
          onClick={() => setPage('activity')}
        >
          🗓 Scheduled
        </button>

        <button
          className={page === 'profile' ? 'nav-active' : ''}
          onClick={() => setPage('profile')}
        >
          👤 Profile
        </button>

      </nav>

      <button
        className="logout-side-btn"
        onClick={() => setPage('login')}
      >
        Logout
      </button>

    </aside>
  )

  // PAGE 2 - SCHEDULE & SEND
  if (page === 'schedule') {
    return (
      <div className="main-layout">

        <Navigation />

        <main className="content">

          <div className="page-header">
            <div>
              <h1>Schedule & Send</h1>
              <p>
                Send an email now or schedule it for later.
              </p>
            </div>

            <button
              className="profile-icon"
              onClick={() => setPage('profile')}
            >
              👤
            </button>
          </div>

          {apiError && (
            <div className="api-error">
              {apiError}
            </div>
          )}

          <div className="send-card">

            <h2>Create Email</h2>

            <div className="field">
              <label>From</label>

              <select>
                {emailAccounts.length > 0 ? (
                  emailAccounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.email}
                    >
                      {account.displayName} — {account.email}
                    </option>
                  ))
                ) : (
                  <option>
                    No connected account
                  </option>
                )}
              </select>
            </div>

            <div className="field">
              <label>To</label>

              <input
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Subject</label>

              <input
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Message</label>

              <textarea
                placeholder="Write your email..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="send-mode">

              <button
                className={
                  sendMode === 'now'
                    ? 'mode-active'
                    : ''
                }
                onClick={() => setSendMode('now')}
              >
                Send Now
              </button>

              <button
                className={
                  sendMode === 'schedule'
                    ? 'mode-active'
                    : ''
                }
                onClick={() => setSendMode('schedule')}
              >
                Schedule
              </button>

            </div>

            {sendMode === 'schedule' && (
              <div className="schedule-fields">

                <div className="field">
                  <label>Date</label>

                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) =>
                      setScheduleDate(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Time</label>

                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) =>
                      setScheduleTime(e.target.value)
                    }
                  />
                </div>

              </div>
            )}

            <button
              className="primary-action"
              onClick={() => setPage('compose')}
            >
              {sendMode === 'now'
                ? 'Send Email'
                : 'Schedule Email'}
            </button>

          </div>

        </main>
      </div>
    )
  }

  // PAGE 3 - EMAIL ACTIVITY
  if (page === 'activity') {
    return (
      <div className="main-layout">

        <Navigation />

        <main className="content">

          <div className="page-header">
            <div>
              <h1>Email Activity</h1>
              <p>
                View your sent and scheduled emails.
              </p>
            </div>

            <button
              className="profile-icon"
              onClick={() => setPage('profile')}
            >
              👤
            </button>
          </div>

          <div className="activity-stats">

            <div>
              <span>Sent</span>
              <strong>{sentEmails.length}</strong>
            </div>

            <div>
              <span>Scheduled</span>
              <strong>{pendingEmails.length}</strong>
            </div>

            <div>
              <span>Campaigns</span>
              <strong>{campaigns.length}</strong>
            </div>

          </div>

          <section className="activity-card">

            <div className="activity-header">
              <h2>Messages</h2>

              <button
                className="small-compose-btn"
                onClick={() => setPage('compose')}
              >
                ✎ Compose
              </button>
            </div>

            {loading ? (
              <div className="loading">
                Loading emails...
              </div>
            ) : scheduledEmails.length === 0 ? (
              <div className="empty-state">
                No emails found.
              </div>
            ) : (
              scheduledEmails.map((item) => (
                <button
                  className="message-row"
                  key={item.id}
                  onClick={() => {
                    setSelectedEmail(item)
                    setPage('details')
                  }}
                >

                  <div className="message-avatar">
                    {item.recipient
                      ?.charAt(0)
                      ?.toUpperCase() || 'E'}
                  </div>

                  <div className="message-info">
                    <strong>
                      {item.recipient}
                    </strong>

                    <span>
                      {item.subject}
                    </span>
                  </div>

                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>

                  <span className="message-date">
                    {item.sentAt
                      ? new Date(
                          item.sentAt
                        ).toLocaleString()
                      : new Date(
                          item.scheduledAt
                        ).toLocaleString()}
                  </span>

                </button>
              ))
            )}

          </section>

        </main>
      </div>
    )
  }

  // PAGE 4 - MESSAGE DETAILS
  if (page === 'details') {
    return (
      <div className="main-layout">

        <Navigation />

        <main className="content">

          <button
            className="back-link"
            onClick={() => setPage('activity')}
          >
            ← Back to emails
          </button>

          {selectedEmail && (
            <div className="message-detail-card">

              <div className="detail-top">

                <div>
                  <span
                    className={`status ${selectedEmail.status.toLowerCase()}`}
                  >
                    {selectedEmail.status}
                  </span>

                  <h1>
                    {selectedEmail.subject}
                  </h1>
                </div>

              </div>

              <div className="detail-info">

                <div>
                  <span>To</span>
                  <strong>
                    {selectedEmail.recipient}
                  </strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>
                    {selectedEmail.sentAt
                      ? new Date(
                          selectedEmail.sentAt
                        ).toLocaleString()
                      : new Date(
                          selectedEmail.scheduledAt
                        ).toLocaleString()}
                  </strong>
                </div>

              </div>

              <div className="message-body">
                {selectedEmail.body}
              </div>

              {selectedEmail.errorMessage && (
                <div className="error-detail">
                  <strong>Delivery Error</strong>
                  <p>
                    {selectedEmail.errorMessage}
                  </p>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    )
  }

  // PAGE 5 - COMPOSE NEW EMAIL
  if (page === 'compose') {
    return (
      <div className="main-layout">

        <Navigation />

        <main className="content">

          <button
            className="back-link"
            onClick={() => setPage('activity')}
          >
            ← Back
          </button>

          <div className="compose-page-card">

            <div className="page-header">
              <div>
                <h1>Compose New Email</h1>
                <p>
                  Create and send a new message.
                </p>
              </div>
            </div>

            <div className="field">
              <label>From</label>

              <select>
                {emailAccounts.map((account) => (
                  <option
                    key={account.id}
                    value={account.email}
                  >
                    {account.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>To</label>

              <input
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Subject</label>

              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Message</label>

              <textarea
                className="large-message"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="compose-actions">

              <button
                className="secondary-action"
                onClick={() => setPage('activity')}
              >
                Cancel
              </button>

              <button
                className="primary-action"
                onClick={() => setPage('activity')}
              >
                Send
              </button>

            </div>

          </div>

        </main>
      </div>
    )
  }

  // PROFILE PAGE
  if (page === 'profile') {
    return (
      <div className="main-layout">

        <Navigation />

        <main className="content">

          <div className="page-header">
            <div>
              <h1>Profile</h1>
              <p>
                Manage your ReachInbox account.
              </p>
            </div>
          </div>

          <div className="profile-card">

            <div className="large-avatar">
              {emailAccounts[0]?.displayName
                ?.charAt(0)
                ?.toUpperCase() || 'S'}
            </div>

            <h2>
              {emailAccounts[0]?.displayName ||
                'ReachInbox User'}
            </h2>

            <p>
              {emailAccounts[0]?.email ||
                email ||
                'No email available'}
            </p>

            <div className="profile-divider" />

            <div className="profile-stat">
              <span>Connected Accounts</span>
              <strong>
                {emailAccounts.length}
              </strong>
            </div>

            <div className="profile-stat">
              <span>Total Emails</span>
              <strong>
                {scheduledEmails.length}
              </strong>
            </div>

            <div className="profile-stat">
              <span>Campaigns</span>
              <strong>
                {campaigns.length}
              </strong>
            </div>

          </div>

        </main>
      </div>
    )
  }

  return null
}

export default App