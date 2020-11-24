import React from 'react'
import { Gear } from '../api'
import Progress from './Progress'
import './css/GearWidget.css'
import unitAbbreviations from '../helpers/unitAbbreviations'

interface GearWidgetProps {
    key: number,
    gear: Gear,
    distanceUnit: string,
    onClick: any,
}

export const GearWidget = ({gear, distanceUnit, onClick}: GearWidgetProps) => {

    const distanceAbbreviation = ' ' + unitAbbreviations[distanceUnit]

    const distanceProgress = <Progress 
        met={gear.distance} 
        target={gear.milestones.distance.target}
        remaining={gear.milestones.distance.remaining_converted + distanceAbbreviation}
    />
    const timeProgress = <Progress 
        met={gear.moving_time}
        target={gear.milestones.moving_time.target}
        remaining={gear.milestones.moving_time.remaining_converted}
    />
    
    return (
        <div className="gear-widget" onClick={() => onClick(gear.pk)}>
            <div className="gear-name">{gear.name}</div>
            <ul className="stats">
                <div className="stats-section">
                    <li className="stat">
                        <div className="stat-name">Distance ridden</div>    
                        <div className="stat-value">{gear.distance_in_athlete_unit + distanceAbbreviation}</div> 
                    </li>
                    <li className="stat">
                        <div className="stat-name">Distance goal progress</div>
                        <div className="stat-value">
                            {distanceProgress}                       
                        </div> 
                    </li>
                </div>
                <div className="stats-section">
                    <li className="stat">
                        <div className="stat-name">Time ridden</div>
                        <div className="stat-value">{gear.duration.string}</div>  
                    </li>             
                    <li className="stat">
                        <div className="stat-name">Time goal progress</div>
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