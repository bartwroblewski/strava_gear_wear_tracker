import React from 'react'

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

const Test = () => <Form />

export default Test