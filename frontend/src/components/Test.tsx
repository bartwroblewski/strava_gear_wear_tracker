import React from 'react'
import { EditableGearWidget } from './GearWidget'

const Display = ({visible}: {visible: boolean}) => {
    console.log(visible)
    const [show, setShow] = React.useState<boolean>(visible)

    //React.useEffect(() => setShow(visible), [visible])

    return show
        ? <div>Showing</div>
        : null
}

const Test = () => {

    const [visible, setVisible] = React.useState<boolean>(true)

    return (
        <div>
            <Display visible={visible} />
            <button onClick={() => setVisible(prev => !prev)}>Toggle</button>

        </div>
    )
}

export default Test