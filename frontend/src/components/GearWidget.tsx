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
    editMode: boolean,
    setInputs: any,
}

interface MileageDisplayProps {
    gearMileage: number,
    editMode: boolean,
    setInputs: any,
}

const NameDisplay = ({gearName, editMode, setInputs}: NameDisplayProps) => {

    const handleChange = (e: any) => setInputs(prev => {
        return {...prev, ...{name: {value: e.target.value, editMode: prev.name.editMode}}}
    })
    const handleClick = (e: any) => setInputs(prev => {
        return {...prev, ...{name: {value: gearName, editMode: !prev.name.editMode}}}
    })

    return (
        <div className="labeled-element">
            <label>Name: </label>
            {editMode 
                ?   <div>      
                        <input 
                            type="text" 
                            value={gearName}
                            required="required"
                            onChange={handleChange}
                        />
                    </div> 
                :   <div 
                        className='editable-value'
                        onClick={handleClick}>
                        {gearName}
                    </div>
            }
        </div>
    )
}

const MileageDisplay = ({gearMileage, editMode, setInputs}: MileageDisplayProps) => {

    const handleChange = (e: any) => setInputs(prev => {
        return {...prev, ...{mileage: {value: e.target.value, editMode: prev.mileage.editMode}}}
    })
    const handleClick = (e: any) => setInputs(prev => {
        return {...prev, ...{mileage: {value: gearMileage, editMode: !prev.mileage.editMode}}}
    })

    return (
        <div className="labeled-element">
            <label>Mileage: </label>
            {editMode 
                ?   <div>      
                        <input 
                            type="number" 
                            value={gearMileage}
                            //required="required"
                            onChange={handleChange}
                        />
                    </div> 
                :   <div 
                        className='editable-value'
                        onClick={handleClick}>
                        {gearMileage}
                    </div>
            }
        </div>
    )
}

interface BikeSelectProps {
    options: any[],
    setInputs: () => void,
}

const BikeSelect = ({options, setInputs}: BikeSelectProps) => {

    const header = [<option selected disabled>Assigned bikes...</option>]

    const handleChange = (e: any) => {

    }

    return (
        <div>
            <select onChange={handleChange} placeholder='gfgfg'>
                {header.concat(options)}
            </select>
        </div>
    )
}

interface EditableGearWidgetProps {
    gearPk?: number,
    gearName?: string,
    gearMileage?: number,
    gearBikes?: GearBike[],
    bikes: Bike[],
 /*    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any> */ 
}

export const EditableGearWidget = ({gearPk, gearName, gearMileage, gearBikes, bikes}: EditableGearWidgetProps) => {

    const [inputs, setInputs] = React.useState({
        name: {value: gearName, editMode: gearName === undefined},
        mileage: {value: gearMileage, editMode: gearMileage === undefined},
        bike: '',
    })

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log('Submitting inputs for gear: ', gearPk, inputs)
    }
    
    const bikeSelectOptions = bikes.map(bike => {
        const selected = gearBikes ? gearBikes.map(b => b.ref_id).includes(bike.id) : null
        const className = selected ? 'bike-select-selected-option' : null
        return (
            <option 
                className={className}>{bike.name}
            </option>
        )
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <NameDisplay
                    gearName={inputs.name.value}
                    editMode={inputs.name.editMode}
                    setInputs={setInputs}
                />
                <MileageDisplay
                    gearMileage={inputs.mileage.value}
                    editMode={inputs.mileage.editMode}
                    setInputs={setInputs}
                />
                <BikeSelect
                    options={bikeSelectOptions}
                    setInputs={setInputs}
                />
            <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default GearWidget