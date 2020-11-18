import React from 'react'
import './css/UnitSwitch.css'
import capitalize from '../helpers/capitalize'

interface SwitchProps {
    label: string,
    options: string[],
}

const Switch = ({label, options}: SwitchProps) => {

    const [selectedOption, setSelectedOption] = React.useState<string>(options[0])

    const handleClick = (option: string) => {
        setSelectedOption(option)
    }

    const opts = options.map(o => {
        const className = selectedOption === o ? "switch-option-selected" : "switch-option"
        return <div onClick={() => handleClick(o)} className={className}>{o}</div>
    })

    return (
        <div className="switch">
            <div className="switch-label">{`${capitalize(label)} in:`}</div>
            <div className="switch-options">
                {opts}
            </div>
        </div>
    )
}

const DistanceSwitch = () => {
    return (
        <Switch 
            label="distance" 
            options={["kilometers", "miles"]}
        />
    )
}

const TimeSwitch = () => {
    return (
        <Switch 
            label="time"
            options={['hours', 'days']}
        />
    )
}

const UnitSwitch = () => {
    return (
        <div id="unit-switch">
            <DistanceSwitch />
            <TimeSwitch />
        </div>
    )
}
export default UnitSwitch