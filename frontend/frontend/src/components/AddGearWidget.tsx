import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'
import AddGearButton from './AddGearButton'
import { addGear } from '../api'
import './css/AddGearWidget.css'

interface AddGearWidgetProps {
    getGear: () => void,
}

const AddGearWidget = ({getGear}: AddGearWidgetProps) => {

    const [showModal, setShowModal] = React.useState(false)
    const onClick = () => setShowModal(prev => !prev)

    return (
        <div>
            {showModal ? 
                <div className="modal">
                    <div>
                        Gear name: <input type="text"/>
                        Initial mileage: <input type="number"/>
                        Track: <input type="checkbox"/>
                    </div>
                    <div>
                        <button>OK</button>
                        <button>Cancel</button>
                    </div>
                </div>
            : null}
            <AddGearButton 
                addGear={addGear}
                getGear={getGear}
            />
            <button onClick={() => onClick()}>Show modal</button>
        </div>
    )
}

export default AddGearWidget