import React from 'react'
import { Gear } from '../api'
import Progress from './Progress'
import './css/GearWidget.css'
import { toHHMMSS } from '../helpers/units'

interface GearWidgetProps {
    key: number,
    gear: Gear,
    distanceUnit: string,
    onClick: any,
}

export const GearWidget = ({gear, distanceUnit, onClick}: GearWidgetProps) => {

    const distanceAbbreviation = ' ' + distanceUnit//' ' + unitAbbreviations[distanceUnit]

    const distanceProgress = <Progress 
        met={gear.distance} 
        target={gear.distance_milestone}
        formatter={toHHMMSS}
   
    />
    const timeProgress = <Progress 
        met={gear.moving_time}
        target={gear.moving_time_milestone}
        formatter={toHHMMSS}
    />
    
    return (
        <div className="gear-widget" onClick={() => onClick(gear.pk)}>
            <div className="gear-name">{gear.name}</div>
            <ul className="stats">
                <div className="stats-section">
                    <div className="stats-section-title">Distance</div>
                    <li className="stat">
                        <div className="stat-name">Ridden</div>    
                        <div className="stat-value">{gear.distance + ' ' +distanceUnit}</div> 
                    </li>
                    <li className="stat">
                        <div className="stat-name">Goal progress</div>
                        <div className="stat-value">
                            {distanceProgress}                       
                        </div> 
                    </li>
                </div>
                <div className="stats-section">
                    <div className="stats-section-title">Time</div>
                    <li className="stat">
                        <div className="stat-name">Ridden</div>
                        <div className="stat-value">{toHHMMSS(gear.moving_time)}</div>  
                    </li>             
                    <li className="stat">
                        <div className="stat-name">Goal progress</div>
                        <div className="stat-value">
                            {timeProgress}                       
                        </div> 
                    </li>
                </div>
            </ul>
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