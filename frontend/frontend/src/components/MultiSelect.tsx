import React from 'react';
import './css/MultiSelect.css'

type MultiSelectOption = string
type Selected = Set<string>

interface MultiSelectProps {
  options: MultiSelectOption[],
}

interface TagProps {
  text: string,
  remove: (arg: any) => void
}

const MultiSelect = ({options}: MultiSelectProps) => {

  const [selected, setSelected] = React.useState<Selected>(new Set([]))
  
  const handleSelectChange = (e: any) => {
    addSelected(e)
  }

  const addSelected = (e: any) => {
    const value = e.target.value
    setSelected(prev => new Set(prev.add(value)))
  }

  const removeSelected = (text: string) => {
    setSelected(prev => new Set(Array.from(prev).filter(x => x !== text)))
  }

  const opts = options.map(o => <option>{o}</option>)
  const tags = Array.from(selected).map(s => {
     return <Tag text={s} remove={removeSelected} />
  })

  return (
    <div>
      <select onChange={handleSelectChange}>{opts}</select>
      {tags}
    </div>
  )
}

const Tag = ({text, remove}: TagProps) => {

  const handleCrossClick = () => {
    remove(text)
  }


  return (
    <div className="tag">
      {text}
      <span onClick={handleCrossClick}className="tag-delete">X</span>
    </div>
  )
}

const App = () => {

  return (
    <MultiSelect options={['aaaa', 'bbbb', 'cccccc']} />
  );
}

export default MultiSelect;
