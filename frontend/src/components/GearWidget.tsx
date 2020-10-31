import React from 'react'
import { GearBike, Bike } from '../api'
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

    const [editMode, setEditMode] = React.useState<boolean>(gearName === undefined)
    const [value, setValue] = React.useState<string>(gearName)

    const handleChange = (e: any) => setValue(e.target.value)
    const handleClick = (e: any) => setEditMode(true)
    const handleSubmit = (e: any) => {
        e.preventDefault()
        setEditMode(false)
    }

    return (
        <div className="labeled-element">
            <label>Name: </label>
            {editMode 
                ?   <div>      
                        <form onSubmit={handleSubmit}>   
                            <input 
                                type="text" 
                                value={value}
                                required="required"
                                onChange={handleChange}
                            />
                            <input 
                                type="submit"
                                hidden
                            />
                        </form>
                    </div> 
                :   <div 
                        className='editable-value'
                        onClick={handleClick}>
                        {value}
                    </div>
            }
        </div>
    )
}

const MileageDisplay = ({gearMileage}: MileageDisplayProps) => {

    const [editMode, setEditMode] = React.useState<boolean>(gearMileage === undefined)
    const [value, setValue] = React.useState<string>(gearMileage)

    const handleChange = (e: any) => setValue(e.target.value)
    const handleClick = (e: any) => setEditMode(true)
    const handleSubmit = (e: any) => {
        e.preventDefault()
        setEditMode(false)
    }

    return (
        <div className="labeled-element">
            <label>Mileage: </label>
            {editMode 
                ?   <div>      
                        <form onSubmit={handleSubmit}>   
                            <input 
                                type="number" 
                                value={value}
                                required="required"
                                onChange={handleChange}
                            />
                            <input 
                                type="submit"
                                hidden
                            />
                        </form>
                    </div> 
                :   <div 
                        className='editable-value'
                        onClick={handleClick}>
                        {value}
                    </div>
            }
        </div>
    )
}

interface BikeSelectProps {
    gearBikes: GearBike[],
    bikes: Bike[],
}

const BikeSelect = ({gearBikes, bikes}: BikeSelectProps) => {

    const options = bikes.map(bike => {
        const selected = gearBikes.map(b => b.ref_id).includes(bike.id)
        const className = selected ? 'bike-select-selected-option' : null
        return <option className={className}>{bike.name}</option>
    })

    const handleClick = (e: any) => {
        console.log(bikes, gearBikes)
    }

    return (
        <div>
            <label>Bike(s): </label>
            <select onClick={handleClick}>
                {options}
            </select>
        </div>
    )
}

interface EditableGearWidgetProps {
    gearName?: string,
    gearMileage?: number,
    gearBikes?: GearBike[],
    bikes: Bike[],
 /*    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any> */ 
}

export const EditableGearWidget = ({gearName, gearMileage, gearBikes, bikes}: EditableGearWidgetProps) => {

    return (
        <div>
            <NameDisplay
                gearName={gearName}
            />
            <MileageDisplay
                gearMileage={gearMileage}
            />
            <BikeSelect
                gearBikes={gearBikes}
                bikes={bikes}
            />
        </div>
    )
}


export default GearWidget