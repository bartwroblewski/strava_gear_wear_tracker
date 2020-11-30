import React from 'react'
import { toDuration } from '../helpers/formatters'

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
    const factors = {d: 86400, h: 3600, m: 60, s: 1}

    const changeTime = (prev: number, curr: number, unit: string) => {
            const factor = factors[unit]
            return prev - (toDuration(prev)[unit] * factor) + (curr * factor)
    }

    const handleChange = e => {
        const curr = e.target.value
        const unit = e.target.name
        setTime(prev => changeTime(prev, curr, unit))
    }

    return (
        <div>
            <input defaultValue={duration.d} name="d" type="number" onChange={handleChange} />
            <label>d</label>

            <input defaultValue={duration.h} name="h" type="number" onChange={handleChange} />
            <label>h</label>

            <input defaultValue={duration.m} name="m" type="number" onChange={handleChange} />
            <label>m</label>

            <input defaultValue={duration.s} name="s" type="number" onChange={handleChange} />
            <label>s</label>
        </div>
    )
}

export default TimeInput