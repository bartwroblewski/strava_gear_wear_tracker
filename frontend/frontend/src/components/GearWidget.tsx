import React from 'react'
import { isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'

interface GearWidgetProps {
    gearName: string,
    gearMileage: number,
    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any>,
}

const GearWidget = ({gearName, gearMileage, toggleGearTracking, is_tracked, getGear, deleteGear}: GearWidgetProps) => {

    const handleCheckboxChange = async() => {
        await toggleGearTracking(gearName) // change is_tracked value in database
        getGear() // fetch fresh gear from database to include newly changed is_tracked value
    }

    const handleButtonClick = async() => {
        await deleteGear(gearName)
        getGear()
    }

    return (
        <div style={{
            border: '1px solid black',
            display: 'inline-block',
        }}>
            <div>Name: {gearName}</div>
            <div>Mileage: {gearMileage}</div>
            <div>
                Track
                <input 
                    type="checkbox" 
                    onChange={handleCheckboxChange}
                    checked={is_tracked}
                />
            </div>
            <button onClick={handleButtonClick}>Delete</button>
        </div>
    )
}


export default GearWidget