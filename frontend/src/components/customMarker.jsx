import {React, FunctionComponent, useState} from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'


function customMarker(position, data1, data2) {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  

  return (
    <AdvancedMarker>

    </AdvancedMarker>
  )
}

export default customMarker