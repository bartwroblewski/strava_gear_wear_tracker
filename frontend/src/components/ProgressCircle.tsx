import React from 'react'

interface ProgressCircleProps {
    met: number,
    target: number,
}

const ProgressCircle = ({met, target}: ProgressCircleProps) => {

    const width = 25
    const height = 25
    const cx = width * (50 / 100)
    const cy = height * (50 / 100)
    const r = width * (40 / 100)

    return (
        <svg width={width} height={height}>
            <circle cx={cx} cy={cy} r={r} stroke="black" fill="white" />
        </svg>
    )
}

export default ProgressCircle