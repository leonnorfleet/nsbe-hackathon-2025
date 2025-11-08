import {React, FunctionComponent, useState} from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import '../styles/custom-advanced-marker.css'
import { HouseIcon } from '../assets/house-icon'
import ListingDetails from '../assets/listing-details'

const renderCustomPin = (data) => {
  return (
    <>
      <div className="custom-pin">
        <button className="close-button">
          <span className="material-symbols-outlined"> close </span>
        </button>

        <div className="image-container">
          <span className="icon">
            <HouseIcon />
          </span>
        </div>

        <ListingDetails data={data}/>
      </div>

      <div className="tip" />
    </>
  )
}

function CustomMarker({data}) {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  console.log(data.lat, data.lng)


  return (
    <AdvancedMarker
      position={{lat: data.lat, lng: data.lng}}
      title={'Placeholder Title'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      className={`real-estate-marker ${clicked && 'clicked'} ${hovered && 'hovered'}`}>
      {renderCustomPin(data)}
    </AdvancedMarker>
    
  )
}

export default CustomMarker