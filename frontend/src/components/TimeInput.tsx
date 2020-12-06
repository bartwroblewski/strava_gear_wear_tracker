import React from 'react'
import { toDuration, timeFactors } from '../helpers/formatters'
import './css/TimeInput.css'

interface TimeInputProps {
    time: any,
    setTime: any,
}

interface Duration {
    d: number,
    h: number,
    m: number,
    s: number,
}

const TimeInput = ({time, setTime} : TimeInputProps) => {

    const duration = toDuration(time)
    
    const changeTime = (prev: number, curr: number, unit: string) => {
            const factor = timeFactors[unit]
            const newTime = prev - (toDuration(prev)[unit] * factor) + (curr * factor)
            return newTime
    }

    const handleChange = e => {
        const curr = e.target.value
        const unit = e.target.name
        setTime(prev => changeTime(prev, curr, unit))
    }

    return (
        <div className="time-input">
            <input defaultValue={duration.d} name="d" type="number" min="0" onChange={handleChange} />
            <label>d</label>

            <input defaultValue={duration.h} name="h" type="number" min="0" onChange={handleChange} />
            <label>h</label>

            <input defaultValue={duration.m} name="m" type="number" min="0" onChange={handleChange} />
            <label>m</label>

            <input defaultValue={duration.s} name="s" type="number" min="0" onChange={handleChange} />
            <label>s</label>
        </div>
    )
}

export default TimeInput