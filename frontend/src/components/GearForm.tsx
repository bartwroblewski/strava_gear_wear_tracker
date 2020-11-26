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

    const [days, setDays] = React.useState<number>()
    const [hours, setHours] = React.useState<number>()
    const [minutes, setMinutes] = React.useState<number>()
    const [seconds, setSeconds] = React.useState<number>()

    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>([])

    const distanceUnits = {
        km: 1000,
        mi: 1609.34,
    }
    const metersToUnit = (meters: number, unit: string) => meters / distanceUnits[unit]

    const toDuration = (seconds: number): Duration => {
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor(seconds / 3600) - (days * 24)
        const minutes = Math.floor(seconds / 60) - (hours * 60)
        console.log(days, hours, minutes)
        return {d: days, h: hours, m: minutes, s: 0}
    }

    const setDefaults = () => {
        setName(gear?.name || '')

        setDistance(metersToUnit(gear?.distance, athleteDistanceUnit) || 0)
        setDistanceMilestone(gear?.distance_milestone || 0)

        setDuration(gear? toDuration(gear.moving_time) : {d: 1, h: 1, m: 1, s: 1})
        setDurationMilestone({d: 0, h: 0, m: 0, s: 0})

        setDays(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)

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
            //durationMilestone
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
                <input value={duration.d}type="number" min="0" required onChange={e => setDuration(prev => ({...prev, days: e.target.value}))} />
                <label>d</label>  

                <input value={duration.h}type="number" min="0" max="23" required onChange={e => setDuration(prev => ({...prev, hours: e.target.value}))} />
                <label>h</label>  

                <input value={duration.m}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, minutes: e.target.value}))} />
                <label>m</label>  

                <input value={duration.s}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, seconds: e.target.value}))} />
                <label>s</label>  
            </div>
            
            <label>Time goal: </label>
            <div>
                <input value={days}type="number" min="0" required onChange={e => setDays(e.target.value)} />
                <label>d</label>  

                <input value={hours}type="number" min="0" max="23" required onChange={e => setHours(e.target.value)} />
                <label>h</label>  

                <input value={minutes}type="number" min="0" max="59" required onChange={e => setMinutes(e.target.value)} />
                <label>m</label>  

                <input value={seconds}type="number" min="0" max="59" required onChange={e => setSeconds(e.target.value)} />
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