import React from 'react'
import './css/Test.css'

const Form = () => {

    const handleSubmit = (e: any) => {
        e.preventDefault()        
        alert('submitted')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" required />
            <input type="checkbox" onChange={(e) => handleSubmit(e)} />
            <button type="submit">Submit</button>
        </form>
    )
}

const Test = () => {
    return null
}

export default Test