import React from 'react'
import { Bike, changeAthlete, Gear} from '../api'
import './css/GearForm.css'
import MultiSelect from './MultiSelect'
import TimeInput from './TimeInput'
import { toDuration, metersToUnit, metersFromUnit } from '../helpers/formatters'

interface GearFormProps {
    gear: Gear,
    athleteDistanceUnit: string,
    bikes: Bike[],
    onSubmit: any,
}

const GearForm = ({gear, athleteDistanceUnit, bikes, onSubmit}: GearFormProps) => {

    const distanceAbbreviation =  ' ' + athleteDistanceUnit
    const distanceToUnit = (meters: number) => metersToUnit(meters, athleteDistanceUnit)
    const distanceFromUnit = (distanceInUnit: number) => metersFromUnit(distanceInUnit, athleteDistanceUnit)

    const pk = gear?.pk || 0 // 0 pk is not very clean...
    
    const [name, setName] = React.useState<string>()
    const [distance, setDistance] = React.useState<number>()
    const [distanceMilestone, setDistanceMilestone] = React.useState<number>()
    const [time, setTime] = React.useState<number>()
    const [timeMilestone, setTimeMilestone] = React.useState<number>()
    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>([])

    const setDefaults = () => {
        setName(gear?.name || '')
        setDistance(gear?.distance || 0)
        setDistanceMilestone(gear?.distance_milestone || 0)
        setTime(gear?.moving_time || 0)
        setTimeMilestone(gear?.moving_time_milestone || 0)
        setTrack(gear?.is_tracked ?? true)
        setBikeIds(gear?.bikes.map(x => x.ref_id) || [])
    }

    React.useEffect(setDefaults, [gear])
 
    const handleSubmit = async(e) => {
        e.preventDefault()
        onSubmit([
            pk,
            name,
            distance, 
            distanceMilestone, 
            time,
            timeMilestone,
            track, 
            bikeIds
        ])
    }

    const handleBikeOptionChange = (bike: Bike) => {
        setBikeIds(prev => {
            if (bikeIds.includes(bike.id)) {
                return prev.filter(id => id !== bike.id)
            } else {
                return [...prev, bike.id] 
            }
        })
    }

    const bikeOptions = bikes.map(bike => {
        return (
          <div className="multi-select-option">
            <input 
                type="checkbox"
                checked={bikeIds.includes(bike.id)}
                /* onChange={e => onSubmit({name: gear.name, bikeId: bike.id, pk: gear.pk})} */
                onChange={() => handleBikeOptionChange(bike)}
            />
            <div>{bike.name}</div>
         </div>
        )
      })
      
    const changeTime = (e: any, prev: number) => {
        const curr = e.target.value
        const unit = e.target.name
        const factors = {d: 86400, h: 3600, m: 60, s: 1}
        const factor = factors[unit]
        return prev - (toDuration(prev)[unit] * factor) + (curr * factor)
    }

    const duration = {
        time: toDuration(time),
        milestone: toDuration(timeMilestone),
    }

    return (
        <form onSubmit={handleSubmit}>

    <div className="form-title">{gear ? 'Edit' : 'Add'} gear</div>
            
            <div className="form-section">
                <label>Name</label>
                <div>
                    <input value={name} type="text" required onChange={e => setName(e.target.value)} />
                </div>
            </div>

            <div className="form-section">
                <label>Distance</label>
                <div>
                    <input value={distanceToUnit(distance)} type="number" min="0" step="0.01" required onChange={e => setDistance(distanceFromUnit(e.target.value))} />
                    <span>{distanceAbbreviation}</span>
                </div>
            </div>

            <div className="form-section">
                <label>Distance goal</label>
                <div>
                    <input value={distanceToUnit(distanceMilestone)} type="number" min="0" step="0.01" required onChange={e => setDistanceMilestone(distanceFromUnit(e.target.value))} />
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
                <input type="checkbox" checked={track} onChange={() => setTrack(prev => !prev)} />
            </div>

            <div className="form-section">
                <MultiSelect options={bikeOptions} />
            </div>

            <div className="form-section">
                <button type="submit">Save</button>
            </div>
        </form>
    )
}

export default GearForm