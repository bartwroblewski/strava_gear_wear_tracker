import React from 'react'
import './css/Test.css'


const DurationInput = () => {
    return (
        <div>
                <label>d: </label>
                <input 
                    type="number"
                    step="1"
                    onChange={e => console.log(e.target.value)}
                />
                <label>h: </label>
                <input 
                    type="number"
                    step="1"
                    onChange={e => console.log(e.target.value)}
                />
                <label>m: </label>
                <input 
                    type="number"
                    step="1"
                    onChange={e => console.log(e.target.value)}
                />
                <label>s: </label>
                <input 
                    type="number"
                    step="1"
                    onChange={e => console.log(e.target.value)}
                />
        </div>
    )
}

const Test = () => <DurationInput />


export default Test