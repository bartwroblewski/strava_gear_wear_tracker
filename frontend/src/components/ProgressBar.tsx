import React from 'react'
import './css/ProgressBar.css'

interface ProgressBarProps {
    met: number,
    target: number,
}

const ProgressBar = ({met, target}: ProgressBarProps) => {

    const perc = met / target * 100
    console.log(met, target, perc)
    const outerW = 100
    const innerW = perc / 100 * outerW
    const h = 10

    return (
            <svg className="progress-bar">
                <g>
                    <rect width={outerW} height={h} stroke="black" fill="none" />
                    <rect width={innerW} height={h} fill="green" />
                </g>
            </svg>
    )
}

export default ProgressBar