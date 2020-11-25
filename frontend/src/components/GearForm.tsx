import React from 'react'
import { Bike } from '../api'
import './css/GearForm.css'
import unitAbbreviations from '../helpers/unitAbbreviations'
import MultiSelect from './MultiSelect'
import { addOrChangeGearUrl } from '../urls'

interface Duration {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

interface GearFormDefaults {
    pk: number,
    name: string,
    distanceUnit: string,
    distance: number,    
    distanceMilestone: number,
    duration: Duration,
    track: boolean,
    bikeIds: string[],
}

interface GearFormProps {
    defaults: GearFormDefaults,
    bikes: Bike[],
    onSubmit: any,
}

const GearForm = ({defaults, bikes, onSubmit}: GearFormProps) => {

    const distanceAbbreviation =  ' ' + defaults.distanceUnit

    const [name, setName] = React.useState<string>()
    const [distance, setDistance] = React.useState<number>()
    const [distanceMilestone, setDistanceMilestone] = React.useState<number>()
    const [days, setDays] = React.useState<number>()
    const [hours, setHours] = React.useState<number>()
    const [minutes, setMinutes] = React.useState<number>()
    const [seconds, setSeconds] = React.useState<number>()
    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>([])

    React.useEffect(() => {
        setName(defaults.name)
        setDistance(defaults.distance)
        setDistanceMilestone(defaults.distanceMilestone)
        setDays(defaults.duration.days)
        setHours(defaults.duration.hours)
        setMinutes(defaults.duration.minutes)
        setSeconds(defaults.duration.seconds)
        setTrack(defaults.track)
        setBikeIds(defaults.bikeIds)
    }, [defaults])
 
    const handleSubmit = async(e) => {
        e.preventDefault()
        onSubmit([defaults.pk, name, distance, distanceMilestone, days, hours, minutes, seconds, track, bikeIds])
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
                /* onChange={e => onSubmit({name: defaults.name, bikeId: bike.id, pk: defaults.pk})} */
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