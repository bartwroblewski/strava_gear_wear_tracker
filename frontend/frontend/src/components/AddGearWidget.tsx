import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'
import { addGear } from '../api'
import './css/AddGearWidget.css'

interface AddGearWidgetProps {
    getGear: () => void,
}

const AddGearWidget = ({getGear}: AddGearWidgetProps) => {

    const [showModal, setShowModal] = React.useState(false)
    const [gearName, setGearName] = React.useState('')
    const [mileage, setMileage] = React.useState('')

    const handleGearNameInputChange = (e: any) => {
        setGearName(e.target.value)
    }

    const handleMileageInputChange = (e: any) => {
        setMileage(e.target.value)
    }

    const handleOkButtonClick = async() => {
        const response_text = await addGear(gearName)
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
                        Gear name: <input type="text" onChange={handleGearNameInputChange} value={gearName}/>
                        Initial mileage: <input type="number" onChange={handleMileageInputChange} value={mileage}/>
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