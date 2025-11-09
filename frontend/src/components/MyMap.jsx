import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { APIProvider, InfoWindow, Map, Marker, Pin } from '@vis.gl/react-google-maps';

import resourceData from '../../../backend/la_food_resources.json'
import CustomMarker from './CustomMarker'

function MyMap() {
    const [openMarkerId, setOpenMarkerId] = useState(null);
    const handleMapClick = () => setOpenMarkerId(null); // close all bubbles

    const mapStyles = [
      { featureType: "water", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#aadaff" }] },
      { featureType: "landscape", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#f0f0f0" }] }
    ];


    return (
        <div className=''>
          <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY || "AIzaSyAzPbSFnZhayxl_Lf5aYUskwbBnh4XF-N0"}>
            <Map
              mapId={'a3bf7de3b28f02d353f73623'}
              style={{ width: '100vw', height: '100vh' }}
              defaultCenter={{ lat: 33.969193238451794, lng: -118.41889905728547 }}
              defaultZoom={13}
              gestureHandling='greedy'
              disableDefaultUI
              onClick={handleMapClick}
              
            />

            {
              resourceData.map((data, i) => (
                <CustomMarker
                  key={i}
                  data={data}
                  isOpen={openMarkerId === i}
                  hide={openMarkerId !== null && openMarkerId !== i} // hide others via CSS
                  onClick={() =>
                    setOpenMarkerId(openMarkerId === i ? null : i)
                  }
                />
              ))
            }
          </APIProvider>
        </div>
    )
}

export default MyMap