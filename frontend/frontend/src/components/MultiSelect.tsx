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
  remove: () => void
}

const MultiSelect = ({onChange, options, placeholder_text, label, name}: MultiSelectProps) => {
  const [selected, setSelected] = React.useState<Selected>(new Set([]))
  const [value, setValue] = React.useState<string>()

  const getOptionIdFromOptionText = (text: string) => {
    return options.filter(o => o.text === text)[0].id
  }

  const getOptionTextFromOptionId = (id: string) => {
    return options.filter(o => o.id === id)[0].text
  }
  
  const handleSelectChange = (e: any) => {
    //e.preventDefault()
    const optionText = e.target.value
    const optionId = getOptionIdFromOptionText(optionText)
    addSelected(optionId)
    setValue(optionText)
    onChange(e, Array.from(selected))
    
  }

  const addSelected = (id: string) => {
    setSelected(prev => new Set(prev.add(id)))
  }

  const removeSelected = (id: string) => {
    setSelected(prev => new Set(Array.from(prev).filter(x => x !== id)))
  }

  const resetValue = () => {
    setValue(placeholder_text)
  }

  const header = <option disabled>{placeholder_text}</option>
  const opts = [header].concat(options.map(o => 
    <option 
      className={selected.has(o.id) ? 'option-selected' : ''}
      id={o.id}>{o.text}</option>
  ))
  const tags = Array.from(selected).map(s => {
    const tagText = getOptionTextFromOptionId(s)
    return <Tag text={tagText} remove={() => removeSelected(s)} />
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
    remove()
  }

  return (
    <div className="tag">
      <span className="tag-text">{text}</span>
      <span onClick={handleCrossClick} className="tag-delete">X</span>
    </div>
  )
}

export default MultiSelect