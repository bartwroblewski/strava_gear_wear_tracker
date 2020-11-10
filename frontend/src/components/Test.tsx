import React from 'react'
import { EditableGearWidget } from './GearWidget'

let SERVERNAME = 'Bartek'
const changeServerName = (newName: string) => SERVERNAME = `aaaaaa${newName}`

interface FormProps {
    serverName: string,
    onSubmit: any,
}

interface InputProps {
    name: string,
    setName: any,
}

const Form = ({serverName, onSubmit}: FormProps) => {

    const [name, setName] = React.useState<string>(serverName)

    React.useEffect(() => setName(serverName), [serverName])

    return (
        <form onSubmit={(e: any) => onSubmit(e, name)}>
            <NameInput 
                name={name}
                setName={setName}
            />
        </form>
    )
}

const NameInput = ({name, setName}: InputProps) => {
    return (
        <input 
            onChange={(e: any) => setName(e.target.value)}
            type="text" 
            value={name}
        />
    )
}
const Test = () => {

    const [serverName, setServerName] = React.useState<string>()

    const getServerName = () => setServerName(SERVERNAME)

    const handleSubmit = (e: any, name: string) => {
        e.preventDefault()
        changeServerName(name)
        getServerName()
    }

    React.useEffect(getServerName, [])

    return (
        <div>
            <div>{serverName}</div>
            <Form serverName={serverName} onSubmit={handleSubmit} />
        </div>
    )
}

export default Test