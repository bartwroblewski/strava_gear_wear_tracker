import React from 'react'
import './css/Test.css'

const TimeInput = ({time, setTime}: {time: any, setTime: any}) => {

    const [t, setT] = React.useState<any>(time)

    React.useEffect(() => setT(time), [time])

    return <input value={t} />
}

const App = () => {
    
    const [time, setTime] = React.useState<number>(10000)

    return (
        <div>
            <TimeInput time={time} setTime={setTime} />
            <button onClick={() => setTime(500000)}>Change</button>
        </div>
    )
}

const Test = () => <App />

export default Test