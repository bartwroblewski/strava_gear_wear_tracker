import React from 'react'
import { GearBike } from '../api'
import BikeList from './BikeList'
import './css/GearWidget.css'

interface GearWidgetProps {
    gearName: string,
    gearMileage: number,
    gearBikes: GearBike[],
    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any>,
}

const GearWidget = ({gearName, gearMileage, gearBikes, toggleGearTracking, is_tracked, getGear, deleteGear}: GearWidgetProps) => {

    const handleCheckboxChange = async() => {
        await toggleGearTracking(gearName) // change is_tracked value in database
        getGear() // fetch fresh gear from database to include newly changed is_tracked value
    }

    const handleButtonClick = async() => {
        await deleteGear(gearName)
        getGear()
    }

    return (
        <div className="gear-widget">
            <div>Name: {gearName}</div>
            <div>Mileage: {gearMileage}</div>
            <BikeList bikes={gearBikes} />
            <div>
                Track
                <input 
                    type="checkbox" 
                    onChange={handleCheckboxChange}
                    checked={is_tracked}
                />
            </div>
            <button 
                className="delete-gear-widget-button"
                onClick={handleButtonClick}>Delete
            </button>
        </div>
    )
}

interface NameDisplayProps {
    gearName: string,
}

interface MileageDisplayProps {
    gearMileage: number,
}

const NameDisplay = ({gearName}: NameDisplayProps) => {

    const [editMode, setEditMode] = React.useState<boolean>(Boolean(!gearName))
    const [value, setValue] = React.useState<string>(gearName)

    const handleChange = (e: any) => setValue(e.target.value)
    const handleSubmit = (e: any) => {
        e.preventDefault()
        setEditMode(false)
    }

    return (
        <div className="labeled-input">
            <label>Name: </label>
            {editMode 
                ?   <div>      
                        <form onSubmit={handleSubmit}>   
                            <input 
                                type="text" 
                                onChange={handleChange}
                            />
                            <button 
                                disabled={!Boolean(value)}
                                type="submit">OK
                            </button>
                        </form>
                    </div> 
                :   <div 
                        className='editable-value'
                        onClick={() => {
                            setEditMode(true)
                            setValue(null)
                        }}>
                        {value}
                    </div>
            }
        </div>
    )
}

const MileageDisplay = ({gearMileage}: MileageDisplayProps) => {

    const [editMode, setEditMode] = React.useState<boolean>(true)

    return editMode
        ?   <div>
                <label>Mileage: </label>
                <input type="number" min="0" />
            </div>
        :   <div>{gearMileage}</div>
}

interface EditableGearWidgetProps {
    gearName?: string,
    gearMileage?: number,
    /*gearBikes: GearBike[],
    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any> */
}

export const EditableGearWidget = ({gearName, gearMileage}: EditableGearWidgetProps) => {

    return (
        <div>
            <NameDisplay
                gearName={gearName}
            />
            <MileageDisplay
                gearMileage={gearMileage}
            />
        </div>
    )
}


export default GearWidget