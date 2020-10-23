import React from 'react'
import { isPropertySignature} from 'typescript'
import './css/MultiSelect.css'

type Selected = Set<string>

interface MultiSelectOption {
  text: string,
  id: string,
}

interface MultiSelectProps {
  onChange: any,
  options: MultiSelectOption[],
  placeholder_text: string,
  label: string,
  name: string,
}

interface TagProps {
  text: string,
  remove: (arg: any) => void
}

const MultiSelect = ({onChange, options, placeholder_text, label, name}: MultiSelectProps) => {
  const [selected, setSelected] = React.useState<Selected>(new Set([]))
  const [value, setValue] = React.useState<string>()
  
  const handleSelectChange = (e: any) => {
    //e.preventDefault()
    addSelected(e.target.value)
    setValue(e.target.value)
    onChange(e)
    
  }

  const addSelected = (text: string) => {
    setSelected(prev => new Set(prev.add(text)))
  }

  const removeSelected = (text: string) => {
    setSelected(prev => new Set(Array.from(prev).filter(x => x !== text)))
  }

  const resetValue = () => {
    setValue(placeholder_text)
  }

  const header = <option disabled>{placeholder_text}</option>
  const opts = [header].concat(options.map(o => 
    <option 
      className={selected.has(o.text) ? 'option-selected' : ''}
      id={o.id}
    >{o.text}</option>
  ))
  const tags = Array.from(selected).map(s => {
     return <Tag text={s} remove={removeSelected} />
  })

  React.useEffect(() => {
    if (selected.size === 0) {
      resetValue()
    }
  }, [selected])

  return (
    <div className="multi-select">
      <label>{`${label}: `}</label>
      <select 
        value={value} 
        onChange={handleSelectChange}
        name={name}
      >
        {opts}
      </select>
      <div className='tags-container'>
        {tags}
      </div>
    </div>
  )
}

const Tag = ({text, remove}: TagProps) => {

  const handleCrossClick = () => {
    remove(text)
  }

  return (
    <div className="tag">
      <span className="tag-text">{text}</span>
      <span onClick={handleCrossClick} className="tag-delete">X</span>
    </div>
  )
}

export default MultiSelect