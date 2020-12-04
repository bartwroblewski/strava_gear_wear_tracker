import React from 'react'
import './css/DistanceSwitch.css'
import capitalize from '../helpers/capitalize'

interface SwitchProps {
    label: string,
    options: string[],
    selectedUnit: string,
    onChange: any;
}

const Switch = ({label, options, selectedUnit, onChange}: SwitchProps) => {

    const handleClick = (option: string) => {
        onChange(option)

    }

    const opts = options.map(o => {
        const className = selectedUnit === o ? "switch-option-selected" : "switch-option"
        return <div onClick={() => handleClick(o)} className={className}>{o}</div>
    })

    return (
        <div className="switch">
            <div className="switch-label">{`${capitalize(label)} unit:`}</div>
            <div className="switch-options">
                {opts}
            </div>
        </div>
    )
}

const DistanceSwitch = ({selectedUnit, onChange}: {selectedUnit: string, onChange: any}) => {
    return (
        <Switch 
            label="distance" 
            options={["km", "mi"]}
            selectedUnit={selectedUnit}
            onChange={onChange}
        />
    )
}

export default DistanceSwitch