import React from 'react'
import './css/Progress.css'
import { toHHMMSS } from '../helpers/units'

interface ProgressProps {
    met: number,
    target: number,
    remainingFormatter: (x: number) => string,
}

interface ProgressBarProps {
    factor: number,
}

const ProgressBar = ({factor}: ProgressBarProps) => {

    const outerW = 100
    const innerW = factor * outerW
    const h = 5.5
    const viewBox= `0 0 ${outerW} ${h}`

    return (       
            <svg viewBox={viewBox}>
                <g>
                    <rect width="100%" height="100%" stroke="black" fill="none" />
                    <rect width={innerW} height="100%" fill="grey" fillOpacity=".5" />
                </g>
            </svg>
    )
}

const Progress = ({met, target, remainingFormatter}: ProgressProps) => {

    const factor = met / target
    const metPercentage = factor * 100
    const metPercentageString = parseFloat(metPercentage).toFixed(0) + '%'

    const remaining = target - met
    
    const summary = remaining <= 0 
        ? <div className="goal-met">100%</div>
        : <div>{metPercentageString + ' (' + remainingFormatter(remaining) + ' remaining)'}</div>

    return (
        target
            ?
                <div>
                    {summary}
                    <ProgressBar factor={factor} />
                </div>
            : '-'
    )
}

export default Progress