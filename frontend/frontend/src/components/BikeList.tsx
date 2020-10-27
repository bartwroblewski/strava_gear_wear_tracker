import React from 'react'
import { GearBike } from '../api'

interface BikeListProps {
    bikes: GearBike[],
}

const BikeList = ({bikes}: BikeListProps) => {

    const bikeNames = bikes.length 
        ? bikes.map(bike => bike.name).join(', ')
        : 'No bikes assigned!'

    return (
        <div>
            <label>Bike(s): </label>
            {bikeNames}
        </div>
    )
}

export default BikeList