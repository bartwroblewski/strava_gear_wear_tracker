import React from 'react'

interface ProgressProps {
    met: number,
    target: number,
    remaining: string | number
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

const Progress = ({met, target, remaining}: ProgressProps) => {

    const factor = met / target
    const metPercentage = parseFloat(factor * 100).toFixed(0) + '%'

    return (
        target
            ?
                <div>
                    <div>{metPercentage} ({remaining} remaining)</div>
                    <ProgressBar factor={factor} />
                </div>
            : '-'
    )
}

export default Progress