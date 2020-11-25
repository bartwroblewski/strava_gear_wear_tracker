import React from 'react'
import { Bike, Gear, GearDuration } from '../api'
import './css/GearForm.css'
import unitAbbreviations from '../helpers/unitAbbreviations'
import MultiSelect from './MultiSelect'
import { addOrChangeGearUrl } from '../urls'

interface GearFormProps {
    gear: Gear,
    athleteDistanceUnit: string,
    bikes: Bike[],
    onSubmit: any,
}

const GearForm = ({gear, athleteDistanceUnit, bikes, onSubmit}: GearFormProps) => {

    const distanceAbbreviation =  ' ' + athleteDistanceUnit

    const pk = gear?.pk || 0 // 0 pk is not very clean...

    const [name, setName] = React.useState<string>()

    const [distance, setDistance] = React.useState<number>()
    const [distanceMilestone, setDistanceMilestone] = React.useState<number>()

    const [duration, setDuration] = React.useState<GearDuration>({})
    const [milestoneDuration, setMilestoneDuration ] = React.useState<GearDuration>()

    const [days, setDays] = React.useState<number>()
    const [hours, setHours] = React.useState<number>()
    const [minutes, setMinutes] = React.useState<number>()
    const [seconds, setSeconds] = React.useState<number>()

    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>([])
  

    const setDefaultInputs = () => {
        setName(gear?.name || '')

        setDistance(gear?.distance_in_athlete_unit || 0)
        setDistanceMilestone(gear?.distance_milestone_in_athlete_unit || 0)

        setDuration(gear?.duration || {days: 0, hours: 0, minutes: 0, seconds: 0})
        setMilestoneDuration(gear?.duration || {days: 0, hours: 0, minutes: 0, seconds: 0})

        setDays(gear?.duration.days || 0)
        setHours(gear?.duration.hours || 0)
        setMinutes(gear?.duration.minutes || 0)
        setSeconds(gear?.duration.seconds || 0)

        setTrack(gear?.is_tracked ?? true)

        setBikeIds(gear?.bikes.map(x => x.ref_id) || [])
    }

    React.useEffect(setDefaultInputs, [gear])
 
    const handleSubmit = async(e) => {
        e.preventDefault()
        onSubmit([
            pk,
            name,
            distance, 
            distanceMilestone, 
            duration, 
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
                <input value={duration.days}type="number" min="0" required onChange={e => setDuration(prev => ({...prev, days: e.target.value}))} />
                <label>d</label>  

                <input value={duration.hours}type="number" min="0" max="23" required onChange={e => setDuration(prev => ({...prev, hours: e.target.value}))} />
                <label>h</label>  

                <input value={duration.minutes}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, minutes: e.target.value}))} />
                <label>m</label>  

                <input value={duration.seconds}type="number" min="0" max="59" required onChange={e => setDuration(prev => ({...prev, seconds: e.target.value}))} />
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