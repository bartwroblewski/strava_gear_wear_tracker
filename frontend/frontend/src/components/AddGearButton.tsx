import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'

interface AddGearButtonProps {
    addGear: (arg: string) => Promise<any>,
    getGear: () => void,
}

const AddGearButton = ({addGear, getGear}: AddGearButtonProps) => {

    const handleClick = async() => {
        const response_text = await addGear('Some new gear!')
        getGear()
    }
    
    return (
        <button onClick={handleClick}>Add new gear</button>
    )
}

export default AddGearButton