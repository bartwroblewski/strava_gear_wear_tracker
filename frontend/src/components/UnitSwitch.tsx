import React from 'react'
import './css/UnitSwitch.css'

interface SwitchOptions {
    label: string,
    options: string[],
}

const Switch = ({label, options}: SwitchOptions) => {

    const [selectedOption, setSelectedOption] = React.useState<string>(options[0])

    const handleClick = option => {
        setSelectedOption(option)
    }

    const opts = options.map(o => {
        const className = selectedOption === o ? "switch-option-selected" : "switch-option"
        return <div onClick={() => handleClick(o)} className={className}>{o}</div>
    })

    return (
        <div className="switch">
            <div className="switch-label">{`${label}:`}</div>
            <div className="switch-options">
                {opts}
            </div>
        </div>
    )
}

const DistanceSwitch = () => <Switch label="Distance in" options={["kilometers", "miles"]} />
const TimeSwitch = () => <Switch label="Time in" options={['hours', 'days']} />

const UnitSwitch = () => {
    return (
        <div id="unit-switch">
            <DistanceSwitch />
            <TimeSwitch />
        </div>
    )
}
export default UnitSwitch