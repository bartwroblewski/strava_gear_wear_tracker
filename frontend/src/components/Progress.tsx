import React from 'react'

interface ProgressProps {
    met: number,
    target: number,
}

interface ProgressBarProps {
    factor: number,
}

const ProgressBar = ({factor}: ProgressBarProps) => {

    const outerW = 100
    const innerW = factor * outerW
    const h = 3.5
    const viewBox= `0 0 ${outerW} ${h}`

    return (       
            <svg viewBox={viewBox}>
                <g>
                    <rect width="100%" height="100%" stroke="black" fill="none" />
                    <rect width={innerW} height="100%" fill="green" fillOpacity="0.5" />
                </g>
            </svg>
    )
}

const Progress = ({met, target}: ProgressProps) => {

    const factor = met / target
    const percentage = parseFloat(factor * 100).toFixed(0) + '%'

    return (
        target
            ?
                <div>
                    <div>{percentage}</div>
                    <ProgressBar factor={factor} />
                </div>
            : '-'
    )
}

export default Progress