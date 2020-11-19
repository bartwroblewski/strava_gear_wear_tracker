import React from 'react'
import './css/MultiSelect.css'

interface MultiSelectProps {
  options: any[],
}


const MultiSelect = ({options}: MultiSelectProps) => {

  const [show, setShow] = React.useState<boolean>(false)

  const handleClick = e => {
      e.preventDefault()
      setShow(prev => !prev)
  }

  return (
      <div className="multi-select">
          <div className="multi-select-title" 
            onClick ={handleClick}
          >
            <div>Bikes</div>
            <div>{'\u25BE'}</div>
          </div>
          {show 
              ?
                  <div 
                    className="multi-select-options-container"
                  >
                      {options}
                  </div>
              : null
          }
      </div>
  )
}

export default MultiSelect