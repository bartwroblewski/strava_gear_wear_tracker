import React from 'react'
import { Bike, Gear} from '../api'
import './css/GearForm.css'
import MultiSelect from './MultiSelect'

interface GearFormProps {
    gear: Gear,
    athleteDistanceUnit: string,
    bikes: Bike[],
    onSubmit: any,
}

interface Duration {
    d: number,
    h: number,
    m: number,
    s: number,
}

const GearForm = ({gear, athleteDistanceUnit, bikes, onSubmit}: GearFormProps) => {

    const distanceAbbreviation =  ' ' + athleteDistanceUnit

    const pk = gear?.pk || 0 // 0 pk is not very clean...

    const [name, setName] = React.useState<string>()
    const [distance, setDistance] = React.useState<number>()
    const [distanceMilestone, setDistanceMilestone] = React.useState<number>()
    const [duration, setDuration] = React.useState<Duration>({})
    const [durationMilestone, setDurationMilestone ] = React.useState<Duration>({})
    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>([])

    const distanceUnits = {
        km: 1000,
        mi: 1609.34,
    }
    const metersToUnit = (meters: number, unit: string) => meters / distanceUnits[unit]

    const toDuration = (seconds: number): Duration => {
        let s = seconds
        const d = Math.floor(s / (3600*24));
        s -= d*3600*24;
        const h = Math.floor(s / 3600);
        s -= h*3600;
        const m = Math.floor(s / 60);
        s -= m*60;
        return {d, h, m, s}
    }

    const noDuration = {d: 0, h: 0, m: 0, s: 0}

    const setDefaults = () => {
        setName(gear?.name || '')
        setDistance(gear ? metersToUnit(gear.distance, athleteDistanceUnit) : 0)
        setDistanceMilestone(gear?.distance_milestone || 0)
        setDuration(gear? toDuration(gear.moving_time) : noDuration )
        setDurationMilestone(gear? toDuration(gear.moving_time_milestone) : noDuration)
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
            duration, 
            durationMilestone,
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

    return (
        <form onSubmit={handleSubmit}>

            <label>Name :</label>
            <input value={name} type="text" required onChange={e => setName(e.target.value)} />

            <label>Distance: </label>
            <div>
                <input value={distance} type="number" min="0" step="0.01" required onChange={e => setDistance(e.target.value)} />
                <span>{distanceAbbreviation}</span>
            </div>

            <label>Distance goal: </label>
            <div>
                <input value={distanceMilestone} type="number" min="0" step="0.01" required onChange={e => setDistanceMilestone(e.target.value)} />
                <span>{distanceAbbreviation}</span>
            </div>

            <label>Time: </label>
            <div>
                <input value={duration.d}type="number" min="0" required onChange={e => setDuration(prev => ({...prev, d: e.target.value}))} />
                <label>d</label>  

                <input value={duration.h}type="number" min="0" max="23" required onChange={e => setDuration(prev => ({...prev, h: e.target.value}))} />
                <label>h</label>  

                <input value={duration.m}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, m: e.target.value}))} />
                <label>m</label>  

                <input value={duration.s}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, s: e.target.value}))} />
                <label>s</label>  
            </div>
            
            <label>Time goal: </label>
            <div>
                <input value={durationMilestone.d}type="number" min="0" required onChange={e => setDurationMilestone(prev => ({...prev, d: e.target.value}))} />
                <label>d</label>  

                <input value={durationMilestone.h}type="number" min="0" max="23" required onChange={e => setDurationMilestone(prev => ({...prev, h: e.target.value}))} />
                <label>h</label>  

                <input value={durationMilestone.m}type="number" min="0" max="59" required onChange={e => setDurationMilestone(prev => ({...prev, m: e.target.value}))} />
                <label>m</label>  

                <input value={durationMilestone.s}type="number" min="0" max="59" required onChange={e => setDurationMilestone(prev => ({...prev, s: e.target.value}))} />
                <label>s</label>  
            </div>

            <label>Track: </label>
            <input type="checkbox" checked={track} onChange={() => setTrack(prev => !prev)} />

            <MultiSelect options={bikeOptions} />

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm