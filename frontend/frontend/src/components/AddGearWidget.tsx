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
    const [mileage, setMileage] = React.useState(0)
    const [track, setTrack] = React.useState(true)

    const handleGearNameInputChange = (e: any) => {
        setGearName(e.target.value)
    }

    const handleMileageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMileage(parseInt(e.target.value))
    }

    const handleTrackInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrack(prev => !prev)
    }

    const handleOkButtonClick = async() => {
        const response_text = await addGear(gearName, mileage, track)
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
                        Track: <input type="checkbox" onChange={handleTrackInputChange} checked={track}/>
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