import { errorMonitor } from 'events'
import React from 'react'
import { setConstantValue } from 'typescript'
import MultiSelect from './MultiSelect'
import { Bike } from '../api'

const errorTexts = {
    name: 'Name cannot be empty!',
    mileage: 'Mileage cannot be less than 1!',
    //bikeName: 'Seems like a bike name error!',
}

interface ErrorContent {
    text: string,
    visible: boolean,
}

interface FormProps {
    bikes: Bike[],
}

const Form = ({bikes}: FormProps) => {

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log('Valid: ', valid())    
        if (valid()) {
            const { name, mileage, bikeIds } = inputs
            console.log('Sumbitting inputs: ', name, mileage, bikeIds)
        } else {
            showAllErrors()  
        }
    }

    const showError = (errorContent: ErrorContent) => ({...errorContent, ...{visible: true}})

    const getVisibleErrors = (errors: any) => {
        let visibleErrors: any = {}
        for (let key in errors) {
            let value: ErrorContent = errors[key]
            visibleErrors[key] = showError(value)
        }
        return visibleErrors
    }

    const showAllErrors = () => setErrors((prev: any) => getVisibleErrors(prev))

    const handleInputChange = (e: any, values?: string[]) => {
        const value = values || e.target.value
        const name = e.target.name
        console.log(name, value)

        // validate input
        let error_text = ''
        switch (name) {
            case 'name':
                error_text = value ? '' : errorTexts.name
                break
           /*  case 'mileage':
                error_text = value < 1 ? errorTexts.mileage : ''             
                break */
/*             case 'bikeName':
                error_text = value ? '' : errorTexts.bikeName
                break */
        }
        const error = {text: error_text, visible: true}
        setErrors((prev: any) => 
            ({...prev, ...{[name]: error}})
        )

        setInputs(prev => 
            ({...prev, ...{[name]: value}})
        )
    }

    const [inputs, setInputs] = React.useState({
        name: '',
        mileage: 0,
        bikeIds: [], 
    })

    const [errors, setErrors] = React.useState<any>({
        name: {text: errorTexts.name, visible: false},
        //mileage: {text: errorTexts.mileage, visible: false},
        //bikeName: {text: errorTexts.bikeName, visible: false},

    })

    const valid = () => Object.keys(errors).every(key => !errors[key].text)

    React.useEffect(() => console.log('Errors: ', errors), [errors])

    return (
        <form onSubmit={(e: any) => handleSubmit(e)}>
            <label>Name: </label>
            <input
                value={inputs.name}
                onChange={(e: any) => handleInputChange(e)}
                name="name"
                type="text"
                placeholder={errors.name.visible ? errors.name.text : ''}>
            </input>
            <label>Mileage: </label>
            <input 
                value={inputs.mileage}
                onChange={(e: any) => handleInputChange(e)}
                name="mileage"
                type="number"
                min="0">
            </input>
           {/*  <label>Bike name: </label>
            <input 
                value={inputs.bikeName}
                onChange={(e: any) => handleInputChange(e)}
                name="bikeName"
                type="text"
                placeholder={errors.bikeName.visible ? errors.bikeName.text : ''}>
            </input> */}
            <MultiSelect
                onChange={(e: any, values: string[]) => handleInputChange(e, values)}
                options={bikes.map(bike => ({text: bike.name, id: bike.id}))}
                placeholder_text="Placeholder text"
                label="Select bike"
                name="bikeIds"
            />
            <button type="submit">Submit</button>
        </form>
    )  
}

export default Form