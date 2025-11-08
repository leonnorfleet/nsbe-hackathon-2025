import {
  APIProvider,
  Map,
  Marker,
} from '@vis.gl/react-google-maps'

const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }

const resourceTips = [
  {
    title: 'Plan your visit',
    body: 'Bring reusable bags, check pickup windows, and call ahead if you have accessibility needs.',
  },
  {
    title: 'Stay informed',
    body: 'Enable notifications to receive new postings within your preferred radius directly to your inbox.',
  },
  {
    title: 'Share feedback',
    body: 'Report changes in availability so we can update the map for other community members.',
  },
]

function IndividualsPage() {
  return (
    <div className="page individuals-page themed-surface">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Support for Individuals & Families</p>
          <h1>Find Free Meals and Groceries Nearby</h1>
          <p>
            Use the interactive map to locate food banks and free meals.
            Filter by distance, pickup time, and resource type.
          </p>
        </div>
        <div className="cta-card">
          <h2>Need text alerts?</h2>
          <p>Subscribe with your zip code to get alerts when new resources open in your neighborhood.</p>
          <a className="btn primary" href="#subscribe">Subscribe for updates</a>
        </div>
      </header>

      <section className="map-section">
        <section className="map-wrapper" aria-label="Los Angeles community resources map">
          <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || 'AIzaSyAzPbSFnZhayxl_Lf5aYUskwbBnh4XF-N0'}>
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={11}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <Marker position={DEFAULT_CENTER} title="Downtown Los Angeles" />
            </Map>
          </APIProvider>
        </section>
        <aside className="map-sidebar">
          <h2>Popular resource categories</h2>
          <ul>
            <li>
              <strong>Community Food Banks:</strong> Weekly staples, pantry boxes, and produce hubs.
            </li>
            <li>
              <strong>Same-day surplus:</strong> Restaurants and grocers posting ready-to-eat meals and perishables.
            </li>
            <li>
              <strong>Mutual aid fridges:</strong> 24/7 community-stocked fridges—take what you need, leave what you can.
            </li>
          </ul>
        </aside>
      </section>

      <section className="resource-tips" id="subscribe">
        <div className="section-heading">
          <h2>Make the most of FeedLA</h2>
          <p>Small actions help us keep the map accurate and the shelves stocked for everyone.</p>
        </div>
        <div className="tips-grid">
          {resourceTips.map((tip) => (
            <article key={tip.title}>
              <h3>{tip.title}</h3>
              <p>{tip.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default IndividualsPage

