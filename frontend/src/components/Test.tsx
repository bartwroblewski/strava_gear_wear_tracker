import React from 'react'
import { getAthlete, changeAthlete, deleteAthlete } from '../testapi'

const App = () => {

    const [athlete, setAthlete] = React.useState<any>()

    const fetchAthlete = () => {
        const run = async() => {
            const athlete = await getAthlete(12)
            setAthlete(athlete)
        }
        run()
    }

    const patchAthlete = () => changeAthlete(athlete)

    const handleChange = e => {
        setAthlete(prev => {
            return {...prev, ...{firstname: e.target.value}}
        })
    }

    return (
        <div>
            <div>Athlete: {athlete?.firstname}</div>
            <label>New name</label>
            <input type="text" onChange={e => handleChange(e)} />
            <button onClick={fetchAthlete}>Fetch athlete</button>
            <button onClick={patchAthlete}>Change name</button>
            <button onClick={() => deleteAthlete(athlete.pk)}>Delete athlete</button>
        </div>
    )

}

const Test = () => <App />

export default Test