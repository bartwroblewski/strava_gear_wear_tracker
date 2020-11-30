import React from 'react'
import './css/Test.css'
import Modal from './Modal'

const Form1 = () => {
    return (
        <form>
            <input value="Edit" />
        </form>
    )
}

const Form2 = () => {
    return (
        <form>
            <input value="Delete" />
        </form>
    )
}

const App = () => {

    const [action, setAction] = React.useState<string>()

    const actionForms = {
        edit: Form1,
        delete: Form2,
}

    return (
        <div>
            <button onClick={() => setAction('edit')}>Edit form</button>
            <button onClick={() => setAction('delete')}>Delete form</button>
            {action
                ?
                    <Modal 
                        hide={() => setAction('')} 
                        contents={() => {
                            const form = actionForms[action]
                            return form
                        }}
                    />
                : null
            }
        </div>
    )
}

const Test = () => <App />

export default Test