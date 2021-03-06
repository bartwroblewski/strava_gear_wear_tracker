import React from 'react'
import { Gear } from '../api'
import Progress from './Progress'
import './css/GearWidget.css'
import { toHHMMSS, metersToUnitString } from '../helpers/formatters'

interface GearWidgetProps {
    key: number,
    gear: Gear,
    distanceUnit: string,
    onClick: any,
    onDelete: any,
}

export const GearWidget = ({gear, distanceUnit, onClick, onDelete}: GearWidgetProps) => {
    
    const secondsFormatter = toHHMMSS
    const metersFormatter = metersToUnitString

    const distanceProgress = <Progress 
        met={gear.distance} 
        target={gear.distance_milestone}
        remainingFormatter={(meters) => metersFormatter(meters, distanceUnit)}
   
    />
    
    const timeProgress = <Progress 
        met={gear.moving_time}
        target={gear.moving_time_milestone}
        remainingFormatter={secondsFormatter}
    />
    
    return (
        <div className="gear-widget">
            <div className="gear-widget-delete-container">
                <div className="gear-widget-delete" onClick={() => onDelete(gear.pk)}>X</div>
            </div>
            <div className="gear-name-container">
                <div className="gear-name" onClick={() => onClick(gear.pk)}>{gear.name}</div>
            </div>
            <ul className="stats">
                <div className="stats-section">
                    <div className="stats-section-title bold">Distance</div>
                    <li className="stat">
                        <div className="stat-name">Ridden</div>    
                        <div className="stat-value">{metersFormatter(gear.distance, distanceUnit)}</div> 
                    </li>
                    <li className="stat">
                        <div className="stat-name">Goal progress</div>
                        <div className="stat-value">
                            {distanceProgress}                       
                        </div> 
                    </li>
                </div>
                <div className="stats-section">
                    <div className="stats-section-title bold">Time</div>
                    <li className="stat">
                        <div className="stat-name">Ridden</div>
                        <div className="stat-value">{secondsFormatter(gear.moving_time)}</div>  
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