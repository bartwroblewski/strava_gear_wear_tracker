import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'
import { addGear, Bike } from '../api'
import './css/AddGearWidget.css'

interface AddGearWidgetProps {
    getGear: () => void,
    bikes: Bike[],
}

const AddGearWidget = ({getGear, bikes}: AddGearWidgetProps) => {

    const [showModal, setShowModal] = React.useState(false)
    const [gearName, setGearName] = React.useState('')
    const [mileage, setMileage] = React.useState(0)
    const [track, setTrack] = React.useState(true)
    const [bikeId, setBikeId] = React.useState<string>('')//(bikes[0].id)

    const handleGearNameInputChange = (e: any) => {
        setGearName(e.target.value)
    }

    const handleMileageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMileage(parseInt(e.target.value))
    }

    const handleTrackInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrack(prev => !prev)
    }

    const handleBikeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBikeId(e.target.value)
    }

    const handleOkButtonClick = async() => {
        const success_callback = () => {
            setShowModal(false)
            getGear()
        }
        const response_text = await addGear(
            gearName, 
            bikeId, 
            mileage, 
            track, 
            success_callback,
        )
    }

    const handleCancelButtonClick = () => {
        setShowModal(false)
    }

    const bikeOptions = bikes.map(bike => <option value={bike.id}>{bike.name}</option>)

    return (
        <div>
            {showModal ? 
                <div className="modal">
                    <div>
                        Gear name: <input type="text" onChange={handleGearNameInputChange} value={gearName}/>
                        Initial mileage: <input type="number" onChange={handleMileageInputChange} value={mileage}/>
                        Track: <input type="checkbox" onChange={handleTrackInputChange} checked={track}/>
                        Bike: <select onChange={handleBikeSelectChange}>
                            <option value='' selected>No bike</option>
                            {bikeOptions}
                        </select>
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