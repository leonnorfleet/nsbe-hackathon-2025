import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { APIProvider, InfoWindow, Map, Marker, Pin } from '@vis.gl/react-google-maps';

import resourceData from '../../backend/la_food_resources.json'
import CustomMarker from './components/customMarker';

function App() {

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || "AIzaSyAzPbSFnZhayxl_Lf5aYUskwbBnh4XF-N0"}>
        <Map
          mapId={'a3bf7de3b28f02d353f73623'}
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

        {resourceData && <CustomMarker data={resourceData[0]}/>}

      </APIProvider>
    </>
  )
}

export default App
