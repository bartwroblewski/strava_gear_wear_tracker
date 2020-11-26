import React from 'react'
import { Bike, changeAthlete, Gear} from '../api'
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

    const [time, setTime] = React.useState<number>()
    const [timeMilestone, setTimeMilestone] = React.useState<number>()

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
    const timeDuration = toDuration(time)
    const timeMilestoneDuration = toDuration(timeMilestone)

    const setDefaults = () => {
        setName(gear?.name || '')

        setDistance(gear ? metersToUnit(gear.distance, athleteDistanceUnit) : 0)
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

    const changeTime = (increase: boolean, time: number, seconds: number) => {
        return increase ? time + seconds : time - seconds
    }

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
                <input 
                    defaultValue={toDuration(time).d || 0}
                    type="number"
                    min="0"
                    required
                    onChange={e => setTime(prev => changeTime(e.target.value > timeDuration.d, prev, 86400))} 
                />
                <label>d</label>  

                <input value={timeDuration.h} type="number" min="0" max="23" required />
                <label>h</label>  

                <input value={timeDuration.m} type="number" min="0" max="59" required />
                <label>m</label>  

                <input value={timeDuration.s} type="number" min="0" max="59" required />
                <label>s</label>  
            </div>
            
            <label>Time goal: </label>
            <div>
                <input value={timeMilestoneDuration.d} type="number" min="0" required />
                <label>d</label>  

                <input value={timeMilestoneDuration.h} type="number" min="0" max="23" required />
                <label>h</label>  

                <input value={timeMilestoneDuration.m} type="number" min="0" max="59" required />
                <label>m</label>  

                <input value={timeMilestoneDuration.s} type="number" min="0" max="59" required />
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