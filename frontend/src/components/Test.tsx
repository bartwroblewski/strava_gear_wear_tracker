import React from 'react'
import './css/Test.css'

const Form = () => {

    const [value, setValue] = React.useState()

    return (
        <form>
            <input 
                type="text"
                value={value} 
                onChange={(e) => {
                    const new_value = parseInt(e.target.value)
                    console.log(new_value)
                    setValue(new_value)
                }}
            />
        </form>
    )
}

const Test = () => {
    return (
        <div>
            <select className="select">
                <option>A</option>
                <option>B</option>
            </select>
            <div className="test">Test</div>
        </div>
    )
}

export default Test