import React from 'react'
import { GearBike } from '../api'

interface BikeListProps {
    bikes: GearBike[],
}

const BikeList = ({bikes}: BikeListProps) => {

    const bikeList = bikes.map(bike => {
        return <div>{bike.name}</div>
    })

    return (
        <div>
            {bikeList}
        </div>
    )
}

export default BikeList