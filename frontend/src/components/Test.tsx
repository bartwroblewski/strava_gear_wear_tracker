import React from 'react'
import './css/Test.css'


const Test = () => {
    return (
        <input 
            type="time"
            step="1"
            onChange={e => console.log(e.target.value)}
        />
    )
}


export default Test