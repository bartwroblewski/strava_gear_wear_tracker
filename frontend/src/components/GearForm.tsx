import React from 'react'
import { Gear, Bike } from '../api'
import './css/GearForm.css'
import unitAbbreviations from '../helpers/unitAbbreviations'
import MultiSelect from './MultiSelect'

interface GearFormProps {
    gear: Gear,
    bikes: Bike[]
    onSubmit: any,
}

const GearForm = ({gear, bikes, onSubmit}: GearFormProps) => {

    const [name, setName] = React.useState<string>()
    const [distance, setDistance] = React.useState<number>()
    const [days, setDays] = React.useState<number>()
    const [hours, setHours] = React.useState<number>()
    const [minutes, setMinutes] = React.useState<number>()
    const [seconds, setSeconds] = React.useState<number>()
    const [track, setTrack] = React.useState<boolean>()
    const [bikeIds, setBikeIds] = React.useState<string[]>()

    React.useEffect(() => {
        setName(gear.name)
        setDistance(gear.distance_in_athlete_unit)
        setDays(gear.duration.days)
        setHours(gear.duration.hours)
        setMinutes(gear.duration.minutes)
        setSeconds(gear.duration.seconds)
        setTrack(gear.is_tracked)
    }, [gear])
 
    const handleSubmit = e => {
        e.preventDefault()
        console.log('name', name)
       /*  onSubmit({
            name: gear.name + 'sdfeg',
            //pk: gear.pk,
        }) */
    }

    const bikeOptions = bikes.map(bike => {
        return (
          <div className="multi-select-option">
            <input 
                type="checkbox"
                checked={gear.bikes.map(x => x.name).includes(bike.name)}
                /* onChange={e => onSubmit({name: gear.name, bikeId: bike.id, pk: gear.pk})} */
            />
            <div>{bike.name}</div>
         </div>
        )
      })

    return (
        <form onSubmit={handleSubmit}>

            <label>Name :</label>
            <input value={name} type="text" onChange={e => setName(e.target.value)} />

            <label>Distance: </label>
            <div>
                <input value={distance} type="number" onChange={e => setDistance(e.target.value)} />
                <span>{unitAbbreviations[gear.athlete.distance_unit]}</span>
            </div>

            <label>Time: </label>
            <div>
                <input value={days}type="number" onChange={e => setDays(e.target.value)} />
                <label>d</label>  
                <input value={hours}type="number" onChange={e => setHours(e.target.value)} />
                <label>h</label>  
                <input value={minutes}type="number" onChange={e => setMinutes(e.target.value)} />
                <label>m</label>  
                <input value={seconds}type="number" onChange={e => setSeconds(e.target.value)} />
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