import React from 'react'
import './css/ProgressBar.css'

interface ProgressBarProps {
    met: number,
    target: number,
}

const ProgressBar = ({met, target}: ProgressBarProps) => {

    const outerW = 100
    const innerW = met / target * outerW
    const h = 3.5
    const viewBox= `0 0 ${outerW} ${h}`

    return (
            <svg className="progress-bar" viewBox={viewBox}>
                <g>
                    <rect width="100%" height="100%" stroke="black" fill="none" />
                    <rect width={innerW} height="100%" fill="green" fillOpacity="0.5" />
                </g>
            </svg>
    )
}

export default ProgressBar