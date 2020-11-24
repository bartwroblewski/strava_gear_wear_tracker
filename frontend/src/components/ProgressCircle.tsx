import React from 'react'

interface ProgressCircleProps {
    met: number,
    target: number,
}

const ProgressCircle = ({met, target}: ProgressCircleProps) => {

    const wh = 75
    const cx = wh * (50 / 100)
    const cy = wh * (50 / 100)
    const r = wh * (40 / 100)

    return (
        <svg width={wh} height={wh}>
            <circle cx={cx} cy={cy} r={r} stroke="black" fill="white" />
        </svg>
    )
}

export default ProgressCircle