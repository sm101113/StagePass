
import { useState } from 'react'
import { ethers } from 'ethers'
import { getStagePassContract } from './contracts/StagePass'
import './App.css'

function App() {
  const [notice, setNotice] = useState('')
  const [eventDetails, setEventDetails] = useState(null)

  const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      setNotice('Please install MetaMask first.')
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])

    setNotice(`Wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
  }
   catch (error) {
    setNotice('Wallet connection was not completed.')
  }
}
const loadEvent = async () => {
  try {
    if (!window.ethereum) {
      setNotice('Please install MetaMask first.')
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getStagePassContract(provider)

    const event = await contract.getEvent(1)

    setEventDetails({
      name: event[0],
      price: ethers.formatEther(event[1]),
      totalTickets: event[2].toString(),
      ticketsSold: event[3].toString()
    })

    setNotice('Event details loaded successfully!')
  } catch (error) {
    setNotice('Could not load event. Contract connection is not ready yet.')
  }
}
const bookTicket = async () => {
  try {
    if (!window.ethereum) {
      setNotice('MetaMask is not available.')
      return
    }

    if (!eventDetails) {
      setNotice('Please load event details first.')
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = getStagePassContract(signer)

    const transaction = await contract.bookTicket(1, {
      value: ethers.parseEther(eventDetails.price)
    })

    setNotice('Booking submitted. Waiting for confirmation...')
    await transaction.wait()

    setNotice('Ticket booked successfully!')
    await loadEvent()
  } catch (error) {
    setNotice('Ticket booking could not be completed.')
  }
}
  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="logo">
          STAGE<span>PASS</span>
        </a>

        <div className="nav-links">
          <a href="#events">Explore</a>
          <a href="#army">ARMY Pass</a>
          <a href="#ppw">PPW Pass</a>
        </div>

        <button
  className="wallet-btn"
  onClick={connectWallet}
>
  Connect Wallet
</button>
      </nav>

      <main>
        <section className="hero">
          <p className="eyebrow">
  THE FUTURE OF CONCERT TICKETING
</p>

          <h1>
            YOUR CONCERT.
            <br />
            YOUR TICKET.
            <br />
            <span>YOUR BLOCKCHAIN.</span>
          </h1>

          <p className="hero-text">
            Discover events, collect digital tickets and make
            every concert experience yours with blockchain.
          </p>

          <a href="#events" className="explore-btn">
            Explore Passes <span>↗</span>
          </a>

          <div className="hero-note">
            <span className="live-dot"></span>
            Powered by blockchain technology
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CHOOSE YOUR EXPERIENCE</p>
              <h2>Find Your <span>Stage</span></h2>
            </div>
            <p className="section-description">
              Two communities. One ticketing destination.
            </p>
          </div>

          <div className="pass-grid">
            <article className="pass-card army-card" id="army">
              <div className="card-top">
                <span className="card-label">01 / ARMY PASS</span>
                <span className="card-symbol">✦</span>
              </div>

              <div className="card-content">
                <p className="card-subtitle">PURPLE UNIVERSE</p>
                <h3>ARMY<br />PASS</h3>
                <p>
                  A digital ticket experience inspired by
                  the world of BTS and ARMY.
                </p>
                <a href="#army-events" className="card-btn">
                  Explore ARMY Pass ↗
                </a>
              </div>

              <div className="card-footer">
                <span>COLLECT YOUR MOMENT</span>
                <span>✦ ✦ ✦</span>
              </div>
            </article>

            <article className="pass-card ppw-card" id="ppw">
              <div className="card-top">
                <span className="card-label">02 / PPW PASS</span>
                <span className="card-symbol">✧</span>
              </div>

              <div className="card-content">
                <p className="card-subtitle">A SPECIAL CONNECTION</p>
                <h3>PPW<br />PASS</h3>
                <p>
                  A digital ticket experience inspired by
                  PondPhuwin and their fan community.
                </p>
                <a href="#ppw-events" className="card-btn">
                  Explore PPW Pass ↗
                </a>
              </div>

              <div className="card-footer">
                <span>MAKE IT MEMORABLE</span>
                <span>✧ ✧ ✧</span>
              </div>
            </article>
          </div>
        </section>

        <section className="demo-events" id="army-events">
          <p className="eyebrow">YOUR DIGITAL COLLECTION</p>
          <h2>Upcoming <span>Experiences</span></h2>

          <div className="event-list">
            <div className="event-item">
              <div>
                <span className="event-type">ARMY PASS · DEMO</span>
                <h3>Purple Universe</h3>
                <p>Fictional concert ticket demonstration</p>
              </div>
              <span className="event-tag">COMING SOON</span>
            </div>

            <div className="event-item" id="ppw-events">
              <div>
                <span className="event-type">PPW PASS · DEMO</span>
                <h3>Beyond The Moment</h3>
                <p>Fictional fan meeting ticket demonstration</p>
              </div>
              <span className="event-tag">COMING SOON</span>
            </div>
          </div>
        </section>
{eventDetails && (
  <section className="blockchain-note">
    <div>
      <h3>{eventDetails.name}</h3>
      <p>Ticket Price: {eventDetails.price} ETH</p>
      <p>Total Tickets: {eventDetails.totalTickets}</p>
      <p>Tickets Sold: {eventDetails.ticketsSold}</p>
    </div>
  </section>
)}
        <section className="blockchain-note">
          <span className="note-icon">◇</span>
          <div>
            <h3>Your ticket. On the blockchain.</h3>
            <button className="wallet-btn" onClick={loadEvent}>
  Load Event Details
</button>
{eventDetails && (
  <button className="wallet-btn" onClick={bookTicket}>
    Book Ticket
  </button>
)}
            <p>
              StagePass is an educational blockchain project.
              Transactions will use Sepolia test ETH, not real money.
            </p>
          </div>
        </section>
      </main>

      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice('')}>×</button>
        </div>
      )}

      <footer>
        <a href="#" className="logo">STAGE<span>PASS</span></a>
        <p>
          Unofficial educational demo. Not affiliated with
          BTS, PondPhuwin, or their agencies.
        </p>
        <p>© 2026 StagePass · Built for learning</p>
      </footer>
    </div>
  )
}

export default App
