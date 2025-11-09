import {React, FunctionComponent, useState} from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import '../styles/custom-advanced-marker.css'
import ListingDetails from '../assets/listing-details'
import classNames from 'classnames'
import iconMap from './icons'

function CustomMarker({ data, isOpen, hide, onClick }) {
  return (
    <AdvancedMarker
      position={{ lat: data.lat, lng: data.lng }}
      title={data.name}
      onClick={onClick}
    >
      <div className={classNames('custom-pin', { expanded: isOpen, hidden: hide })}>
        <div className="icon-container">
          {iconMap[data.type]}
        </div>

        {isOpen && (
          <div className="details-bubble visible">
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
            </button>

            <ListingDetails data={data} />
          </div>
        )}
        <div className="tip" />
      </div>
    </AdvancedMarker>
  );
}

export default CustomMarker