import React from 'react'
import { GearBike, Gear} from '../api'
import './css/Forms.css'
import TimeInput from './TimeInput'
import { metersToUnit, metersFromUnit } from '../helpers/formatters'

interface GearFormProps {
    gear: Gear,
    athleteDistanceUnit: string,
    bikes: GearBike[],
    onSubmit: any,
}

const GearForm = ({gear, athleteDistanceUnit, bikes, onSubmit}: GearFormProps) => {

    const distanceAbbreviation =  ' ' + athleteDistanceUnit
    const distanceToUnit = (meters: number) => metersToUnit(meters, athleteDistanceUnit)
    const distanceFromUnit = (distanceInUnit: number) => metersFromUnit(distanceInUnit, athleteDistanceUnit)
    
    const [name, setName] = React.useState<string>(gear?.name || '')
    const [distance, setDistance] = React.useState<number>(gear?.distance || 0)
    const [distanceMilestone, setDistanceMilestone] = React.useState<number>(gear?.distance_milestone || 0)
    const [time, setTime] = React.useState<number>(gear?.moving_time || 0)
    const [timeMilestone, setTimeMilestone] = React.useState<number>(gear?.moving_time_milestone || 0)
    const [track, setTrack] = React.useState<boolean>(gear?.is_tracked ?? true)
    const [bikeIds, setBikeIds] = React.useState<string[]>(gear?.bikes.map(x => x.ref_id) || [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        onSubmit({
            pk: gear?.pk,
            name: name,
            distance: distance, 
            distance_milestone: distanceMilestone, 
            moving_time: time,
            moving_time_milestone: timeMilestone,
            is_tracked: track, 
            bikes: bikeIds,
        })
    }

    const handleBikeSelectChange = (e: any) => {
        const bikeId = e.target.value
        const selected = Array.from(e.target.selectedOptions, (option: any) => option.id)
        setBikeIds(selected)
    }

    const bikeOptions = 
        bikes.map(bike => 
            <option 
                id={bike.ref_id} 
                selected={bikeIds.includes(bike.ref_id)}>
                {bike.name}
            </option>)

    const bikeSelect = 
        <select 
            multiple 
            onChange={handleBikeSelectChange}>
            {bikeOptions}
        </select>

    return (
        <form onSubmit={handleSubmit}>

            <div className="form-title">{gear ? 'Edit' : 'Add'} gear</div>
            
            <div className="form-section">
                <label>Name</label>
                <div>
                    <input 
                        value={name} 
                        type="text" 
                        required 
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-section">
                <label>Distance</label>
                <div>
                    <input value={distanceToUnit(distance)} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        required 
                        onChange={e => setDistance(distanceFromUnit(e.target.value))}
                    />
                    <span>{distanceAbbreviation}</span>
                </div>
            </div>

            <div className="form-section">
                <label>Distance goal</label>
                <div>
                    <input 
                        value={distanceToUnit(distanceMilestone)}
                        type="number" 
                        min="0" 
                        step="0.01" 
                        required 
                        onChange={e => setDistanceMilestone(distanceFromUnit(e.target.value))} 
                    />
                    <span>{distanceAbbreviation}</span>
                </div>
            </div>

            <div className="form-section">
                <label>Time</label>
                <TimeInput time={time} setTime={setTime} />
            </div>
            
            <div className="form-section">
                <label>Time goal</label>
                <TimeInput time={timeMilestone} setTime={setTimeMilestone} />
            </div>

            <div className="form-section">
                <label>Track</label>
                <input 
                    type="checkbox" 
                    checked={track} 
                    onChange={() => setTrack(prev => !prev)}
                />
            </div>

            <div className="form-section">
                <label>Assigned bike(s)</label>
                <div>
                    {bikeSelect}
                </div>
                {/* <MultiSelect options={bikeOptions} /> */}
            </div>

            <div className="form-section">
                <div className="form-buttons">
                    <button type="submit">Save</button>
                </div>
            </div>
        </form>
    )
}

export default GearForm