import React, { useState, useEffect, useMemo, useRef } from 'react'
import Fuse from 'fuse.js'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import PropTypes from 'prop-types'

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function categorizeResource(resource) {
  const name = (resource.name || '').toLowerCase()

  if (name.includes('meal') || name.includes('kitchen') || name.includes('soup')) return 'meals'
  if (name.includes('pantry') || name.includes('food bank') || name.includes('grocery') || name.includes('produce'))
    return 'groceries'
  if (name.includes('senior') || name.includes('wheels')) return 'senior'
  if (name.includes('baby') || name.includes('infant') || name.includes('family')) return 'baby_food'
  return 'general'
}

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

function ChatBot({ onSearch }) {
  const [messages, setMessages] = useState([
    { id: makeId(), sender: 'bot', text: 'Hi! 👋 What kind of food support are you looking for?' },
  ])
  const [userInput, setUserInput] = useState('')

  const handleSend = () => {
    const raw = userInput.trim()
    if (!raw) return

    const input = raw.toLowerCase()
    setMessages((prev) => [...prev, { id: makeId(), sender: 'user', text: raw }])
    setUserInput('')

    const categories = {
      meals: ['meal', 'kitchen', 'soup', 'lunch', 'dinner'],
      groceries: ['food', 'pantry', 'produce', 'grocery', 'staples'],
      senior: ['senior', 'elder', 'wheels'],
      baby_food: ['baby', 'infant', 'formula', 'family'],
    }

    let matched = null
    Object.entries(categories).some(([category, keywords]) => {
      if (keywords.some((kw) => input.includes(kw))) {
        matched = category
        return true
      }
      return false
    })

    if (matched) {
      onSearch({ category: matched, raw })
      setMessages((prev) => [
        ...prev,
        { id: makeId(), sender: 'bot', text: `Searching for ${matched.replace('_', ' ')} options near you…` },
      ])
    } else {
      onSearch({ category: null, raw })
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          sender: 'bot',
          text: "I didn't catch that. Try a word like “meals”, “groceries”, “senior”, or “baby”.",
        },
      ])
    }
  }

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type what you need…"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

function ClusteredMarkers({ locations, mapCenter }) {
  const map = useMap()
  const clustererRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!map || !globalThis.google) return undefined

    if (mapCenter) {
      map.setCenter(mapCenter)
    }

    for (const marker of markersRef.current) {
      marker.setMap(null)
    }
    markersRef.current = []
    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
      clustererRef.current = null
    }

    const markers = locations
      .filter((loc) => Number.isFinite(loc.lat) && Number.isFinite(loc.lng))
      .map((loc) => {
        const marker = new globalThis.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          title: loc.name,
        })
        return marker
      })

    markersRef.current = markers

    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({ markers, map })
    }

    return () => {
      for (const marker of markersRef.current) {
        marker.setMap(null)
      }
      markersRef.current = []
      if (clustererRef.current) {
        clustererRef.current.clearMarkers()
        clustererRef.current = null
      }
ChatBot.propTypes = {
  onSearch: PropTypes.func.isRequired,
}

ClusteredMarkers.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
    })
  ),
  mapCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
}

ClusteredMarkers.defaultProps = {
  locations: [],
  mapCenter: null,
}
    }
  }, [map, locations, mapCenter])

  return null
}

function IndividualsPage() {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources`)
        if (!response.ok) throw new Error('Unable to load resources')

        const data = await response.json()
        const combined = [
          ...(Array.isArray(data.static) ? data.static : []),
          ...(Array.isArray(data.dynamic) ? data.dynamic : []),
        ]
          .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng))
          .map((r) => ({
            ...r,
            category: categorizeResource(r),
          }))

        setResources(combined)
        setFilteredResources(combined)
      } catch (err) {
        console.error(err)
        setError('Unable to load resources right now. Please try again soon.')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(coords)
        setMapCenter(coords)
      },
      () => {
        console.warn('Geolocation not allowed — using default center.')
        setUserLocation(DEFAULT_CENTER)
        setMapCenter(DEFAULT_CENTER)
      }
    )
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: ['name', 'notes', 'category', 'address', 'zone'],
        threshold: 0.4,
      }),
    [resources]
  )

  const handleChatSearch = ({ category, raw }) => {
    if (!resources.length) return

    if (category) {
      const matches = resources.filter((r) => r.category === category)
      updateResults(matches)
    } else {
      const matches = fuse.search(raw).map((m) => m.item)
      if (matches.length === 0) {
        alert(`No resources found for "${raw}". Try another term or a category like “meals”.`)
        return
      }
      updateResults(matches)
    }
  }

  const handleTextSearch = (event) => {
    const term = event.target.value
    if (!term.trim()) {
      setFilteredResources(resources)
      return
    }

    const matches = fuse.search(term).map((m) => m.item)
    updateResults(matches)
  }

  const updateResults = (items) => {
    if (!items.length) {
      setFilteredResources([])
      return
    }

    const sorted = items
      .map((item) => ({
        ...item,
        distance: getDistance(userLocation.lat, userLocation.lng, item.lat, item.lng),
      }))
      .sort((a, b) => a.distance - b.distance)

    setFilteredResources(sorted)
    setMapCenter(sorted[0] ? { lat: sorted[0].lat, lng: sorted[0].lng } : userLocation)
  }

  return (
    <div className="page individuals-page themed-surface">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Support for Individuals & Families</p>
          <h1>Find Free Meals and Groceries Nearby</h1>
          <p>Use the chat below to search by need or browse the map for local food programs.</p>
        </div>
      </header>

      <section className="map-section">
        <section className="map-wrapper" aria-label="Los Angeles community resources map">
          <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <ClusteredMarkers locations={filteredResources} mapCenter={mapCenter} />
            </Map>
          </APIProvider>
        </section>

        <aside className="map-sidebar">
          <h2>Food Finder Chat</h2>
          <ChatBot onSearch={handleChatSearch} />

          <h2>Search manually</h2>
          <input
            type="text"
            placeholder="Search by name, address, or zone"
            onChange={handleTextSearch}
            className="search-input"
          />

          {loading && <p className="placeholder">Loading resources…</p>}
          {error && <p className="placeholder error">{error}</p>}

          {!loading && !error && filteredResources.length > 0 ? (
            <div className="results">
              <h3>Nearby matches</h3>
              <ul className="results-list">
                {filteredResources.map((loc) => (
                  <li key={[loc.name, loc.address, loc.lat, loc.lng].filter(Boolean).join('|')}>
                    <strong>{loc.name}</strong>
                    <p>{loc.address}</p>
                    {loc.phone && <p>📞 {loc.phone}</p>}
                    {loc.website && (
                      <p>
                        🌐{' '}
                        <a href={loc.website} target="_blank" rel="noreferrer">
                          {loc.website}
                        </a>
                      </p>
                    )}
                    {Number.isFinite(loc.distance) && <small>{loc.distance.toFixed(1)} km away</small>}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  )
}

export default IndividualsPage
