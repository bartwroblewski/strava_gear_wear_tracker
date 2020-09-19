import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'
import { addGear } from '../api'
import './css/AddGearWidget.css'

interface AddGearWidgetProps {
    getGear: () => void,
}

const AddGearWidget = ({getGear}: AddGearWidgetProps) => {

    const [showModal, setShowModal] = React.useState(false)

    const handleOkButtonClick = async() => {
        const response_text = await addGear('Some new gear!')
        setShowModal(false)
        getGear()
    }

    const handleCancelButtonClick = () => {
        setShowModal(false)
    }

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
                        <button onClick={handleOkButtonClick}>OK</button>
                        <button onClick={handleCancelButtonClick}>Cancel</button>
                    </div>
                </div>
            : null}
            <button onClick={() => setShowModal(true)}>Add gear</button>
        </div>
    )
}

export default AddGearWidget