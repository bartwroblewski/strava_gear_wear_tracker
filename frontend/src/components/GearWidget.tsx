import React from 'react'
import { Gear, Bike, toggleGearTracking } from '../api'
import './css/GearWidget.css'
import {addOrChangeGear} from '../api'
import MultiSelect from './MultiSelect'
import DurationInput from './DurationInput'
import { metersTo, secondsTo } from '../helpers/unitConverters'

interface GearWidgetProps {
    key: number,
    gear: Gear,
}

export const GearWidget = ({key, gear}: GearWidgetProps) => {

    const [edit, setEdit] = React.useState({
        name: false,
        distance: false,
        time: false,
    })

    const handleSettingClick = e => {
        console.log(e.target.id)
        setEdit(prev => {
            return {...prev, ...{[e.target.id]: !prev[e.target.id]}}
        })
    }

    return (
        <div className="gear-widget">
            <div className="gear-widget-row">
                <label>Name: </label>
                {edit.name
                    ? <form>
                        <input type="text" defaultValue={gear.name}/>
                        <button type="submit">Save</button>
                      </form>
                    : <div id="name" className="gear-widget-setting" onClick={handleSettingClick}>{gear.name}</div>
                }
            </div>
            <div className="gear-widget-row">
                <label>Distance: </label>
                {edit.distance
                    ? <form>
                        <input type="number" defaultValue={gear.distance}/>
                        <button type="submit">Save</button>
                      </form>
                    : <div id="distance" className="gear-widget-setting" onClick={handleSettingClick}>{gear.distance}</div>
}
                </div>
            <div className="gear-widget-row">
                <label>Time: </label>
                {edit.time
                    ? <form>
                        <input type="number" defaultValue={gear.moving_time}/>
                        <input type="number" defaultValue={gear.moving_time}/>
                        <input type="number" defaultValue={gear.moving_time}/>
                        <button type="submit">Save</button>
                      </form>
                    : <div id="time" className="gear-widget-setting" onClick={handleSettingClick}>{gear.moving_time}</div>
                }
            </div>
            <div className="gear-widget-row">
                <button type="button">Edit</button>
            </div>
        </div>
    )
}         

interface AddGearWidgetProps {
    onSubmit: any,
}

export const AddGearWidget = ({onSubmit}: AddGearWidgetProps) => {

    const [name, setName] = React.useState<string>()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        onSubmit({name: name})
        setName('')
    }

    const handleChange = (e: any) => setName(e.target.value)

    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={name}
                type="text"
                placeholder="New gear name?"
                onChange={(e: any) => handleChange(e)}
            />
        </form>
    )
}