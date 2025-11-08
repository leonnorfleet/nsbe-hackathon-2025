import React from 'react';
import './listing-details.css';

function ListingDetails({data}) {

    // change the icons using some icon library

    return (
        <div className="details-container">
            <div className="listing-content">
                <h2>{data.name}</h2>
                <p>{data.address}</p>
                <div className="details">
                    <div className="detail_item">
                        {data.phone /*icon */}
                    </div>
                    <div className="detail_item">
                        {data.zone /*icon */}
                    </div>
                    <div className="detail_item">
                        {data.type /*format this*/ /*icon */}
                    </div>
                </div>

                <p className="description">{data.hours}</p>

                <p className="price">{data.website}</p>
            </div>
        </div>
    )
}

export default ListingDetails