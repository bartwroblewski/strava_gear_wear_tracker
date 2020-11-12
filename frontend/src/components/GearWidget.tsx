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
        <div className="form-input-container">
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
        <div className="form-input-container">
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
                        className=' inputed editable-value'
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

    const handleChange = (e: any) => onChange({e: e, bikeId: e.target.value})

    return (
        <div className="form-input-container">
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

    const handleChange = (e: any) => {
        onChange({e: e, track: !track})
    }

    return (
        <div className="form-input-container">
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
    onDelete: any,
 /*    toggleGearTracking: (arg: string) => Promise<any>,
    is_tracked: boolean,
    getGear: () => void,
    deleteGear: (arg: string) => Promise<any> */ 
}

interface EditableWidgetSubmitParams {
    e: any,
    bikeId?: string,
    track?: boolean,
}

export const EditableGearWidget = ({gearPk, gearName, gearMileage, gearTrack, gearBikes, bikes, onSubmit, onDelete}: EditableGearWidgetProps) => {

    const [name, setName] = React.useState<string>()
    const [mileage, setMileage] = React.useState<number>()
    const [nameEdit, setNameEdit] = React.useState<boolean>()
    const [mileageEdit, setMileageEdit] = React.useState<boolean>()

    const [mousedOver, setMousedOver] = React.useState<boolean>()

    // synchronize state to props
    React.useEffect(() => setMileage(gearMileage || 0), [gearMileage]) /
    React.useEffect(() => setName(gearName || ''), [gearName])
    React.useEffect(() => setNameEdit(gearName === undefined), [gearName])
    React.useEffect(() => setMileageEdit(gearMileage === undefined), [gearMileage])
    
    const handleSubmit = ({e, bikeId, track=gearTrack}: EditableWidgetSubmitParams) => {
        e.preventDefault()
        onSubmit({name: name, pk: gearPk, mileage: mileage, bikeId: bikeId, track: track})

        //setNameEdit(false)
        //setMileageEdit(false)

    }

    const handleDelete = (e: any) => {
        onDelete(gearPk)
    }

    const handleMouseOver = (e: any) => {
        setMousedOver(true)
    }

    const handleMouseOut = (e: any) => {
        setMousedOver(false)
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
        <div 
            className="gear-widget"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <form onSubmit={(e: any) => handleSubmit({e: e})}>
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
                <button type="button" onClick={() => alert(typeof mileage)}>Mileage</button>  
            </form>
        </div>
    )
}

export default GearWidget