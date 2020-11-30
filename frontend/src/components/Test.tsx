import React from 'react'
import './css/Test.css'
import {toDuration} from '../helpers/formatters'
import { rootCertificates } from 'tls'

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

    const changeTime = (e: any, prev: number) => {
            const curr = e.target.value
            const unit = e.target.name
            const factor = factors[unit]
            return prev - (toDuration(prev)[unit] * factor) + (curr * factor)
    }

    return (
        <div>
            <input defaultValue={duration.d} name="d" type="number" onChange={e => setTime(prev => changeTime(e, prev))} />
            <label>d</label>

            <input defaultValue={duration.h} name="h" type="number" onChange={e => setTime(prev => changeTime(e, prev))} />
            <label>h</label>

            <input defaultValue={duration.m} name="m" type="number" onChange={e => setTime(prev => changeTime(e, prev))} />
            <label>m</label>

            <input defaultValue={duration.s} name="s" type="number" onChange={e => setTime(prev => changeTime(e, prev))} />
            <label>s</label>
        </div>
    )
}

const App = () => {
    
    const [time, setTime] = React.useState<number>(100000)

    return <TimeInput time={time} setTime={setTime} />
}

const Test = () => <App />

export default Test