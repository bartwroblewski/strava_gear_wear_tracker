import React from 'react'
import './css/Test.css'

const Widget = ({datum, onDelete}) => {

    const [ask, setAsk] = React.useState()

    const style = {
        display: 'inline-block',
        border: '1px solid black',
        padding: '5px',
    }
    
    return (
        <div style={style}>
            <div>{datum.id}. {datum.name}</div>
            {ask
                ? <div>
                    <button onClick={() => {
                        onDelete(datum.id)
                        //setAsk(false)
                    }}>Yes</button>
                    <button onClick={() => setAsk(false)}>No</button>
                  </div>
                : <button onClick={() => setAsk(true)}>Delete</button>
            }
        </div>
    )
}

const App = () => {

    const [data, setData] = React.useState([
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
        {id: 3, name: 'c'},
    ])

    const handleDelete = (id) => {
        setData(data.filter(x => x.id !== id))
    }

    const widgets = data.map(datum => {
        return (
            <Widget 
                key={datum.id}
                datum={datum}
                onDelete={handleDelete}
            />
        )
    })

    return widgets
}

const Test = () => <App />


export default Test