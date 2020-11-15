import React from 'react'
import './css/MultiSelect.css'

const MultiSelect = () => {

  const [show, setShow] = React.useState<boolean>(false)

  const handleClick = e => {
      e.preventDefault()
      setShow(prev => !prev)
  }

  return (
      <div className="multi-select">
          <select 
              onClick ={handleClick}
          >
              <option>Choose...</option>
          </select>
          {show 
              ?
                  <div className="multi-select-options-container">
                      <div className="multi-select-option">
                          <input type="checkbox" />
                          <div>A</div>
                      </div>
                      <div className="multi-select-option">
                          <input type="checkbox" />
                          <div>B</div>
                      </div>
                      <div className="multi-select-option">
                          <input type="checkbox" />
                          <div>C</div>
                      </div>
                  </div>
              : null
          }
      </div>
  )
}

export default MultiSelect