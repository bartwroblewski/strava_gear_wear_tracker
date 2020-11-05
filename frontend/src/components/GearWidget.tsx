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
    setName: any,
    setNameEdit: any,
}

interface MileageDisplayProps {
    gearMileage: number,
    editMode: boolean,
    setMileage: any,
    setMileageEdit: any,
}

const NameDisplay = ({gearName, editMode, setName, setNameEdit}: NameDisplayProps) => {

    const handleChange = (e: any) => setName(e.target.value)
    const handleClick = (e: any) => setNameEdit(true)

    return (
        <div className="labeled-element">
            <label>Name: </label>
            {editMode 
                ?   <div>      
                        <input 
                            type="text" 
                            value={gearName}
                            
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

const MileageDisplay = ({gearMileage, editMode, setMileage, setMileageEdit}: MileageDisplayProps) => {

    const handleChange = (e: any) => setMileage(e.target.value)
    const handleClick = (e: any) => setMileageEdit(true)

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
    onChange: any,
}

const BikeSelect = ({options, onChange}: BikeSelectProps) => {

    const defaultValue = ""
    const header = [<option disabled value={defaultValue}>Parent bikes...</option>]

    const handleChange = (e: any) => {
        onChange(e, e.target.value)
    }

    return (
        <div>
            <select onChange={handleChange} value={defaultValue}>
                {header.concat(options)}
            </select>
        </div>
    )
}

interface TrackInputProps {
    track: boolean,
    onChange: any,
}

const TrackInput = ({track, onChange}: TrackInputProps) => {

    const handleChange = (e: any) => onChange(e, track=e.target.value)

    return (
        <div>
            <label>Track: </label>
            <input 
                type="checkbox" 
                checked={track}
                onChange={handleChange}
            />
        </div>
    )
}

interface EditableGearWidgetProps {
    gearPk?: number,
    gearName?: string,
    gearMileage?: number,
    gearBikes?: GearBike[],
    gearTrack?: boolean,
    bikes: Bike[],
    onSubmit: any,
 /*    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any> */ 
}

export const EditableGearWidget = ({gearPk, gearName, gearMileage, gearTrack, gearBikes, bikes, onSubmit}: EditableGearWidgetProps) => {

    const [name, setName] = React.useState<string>(gearName)
    const [mileage, setMileage] = React.useState<number>(gearMileage)
    const [nameEdit, setNameEdit] = React.useState<boolean>(gearName === undefined)
    const [mileageEdit, setMileageEdit] = React.useState<boolean>(gearMileage === undefined)
    const [track, setTrack] = React.useState<boolean>(gearTrack)

    const validate = () => Boolean(name) ? null : 'Please fill in the name field first!'
    
    const handleSubmit = (e: any, bikeId?: number, track?: boolean) => {
        e.preventDefault()
        const validationError = validate()
        if (!validationError) {
            onSubmit([gearPk, name, mileage, track].concat(bikeId? [bikeId] : []))

            // on submit, turn off edit mode for all inputs
            setNameEdit(false)
            setMileageEdit(false)
        } else {
            alert(validationError)
        }
    }
    
    const bikeSelectOptions = bikes.map(bike => {
        const selected = gearBikes ? gearBikes.map(b => b.ref_id).includes(bike.id) : null
        const className = selected ? 'bike-select-selected-option' : null
        return (
            <option 
                className={className}
                value={bike.id}
                >{bike.name}
            </option>
        )
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <NameDisplay
                    gearName={name}
                    editMode={nameEdit}
                    setName={setName}
                    setNameEdit={setNameEdit}
                />
                <MileageDisplay
                    gearMileage={mileage}
                    editMode={mileageEdit}
                    setMileage={setMileage}
                    setMileageEdit={setMileageEdit}
                />
                <TrackInput
                    track={gearTrack}
                    onChange={handleSubmit}
                />
                <BikeSelect
                    options={bikeSelectOptions}
                    onChange={handleSubmit}
                /> 
            <button type="submit" hidden>Submit</button>
            </form>
        </div>
    )
}

export default GearWidget