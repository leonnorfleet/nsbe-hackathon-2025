import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

function App() {

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || "AIzaSyAzPbSFnZhayxl_Lf5aYUskwbBnh4XF-N0"}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={{ lat: 33.969193238451794, lng: -118.41889905728547 }}
          defaultZoom={13}
          gestureHandling='greedy'
          disableDefaultUI
        />

        <Marker
          position={{ lat: 33.969193238451794, lng: -118.41889905728547 }}
          clickable={true}
          onClick={() => alert('click')}
          title={'clickable google.maps.Marker'}
        />
      </APIProvider>
    </>
  )
}

export default App
