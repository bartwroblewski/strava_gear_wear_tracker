import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface Authorized {
    authorized: boolean,
    athlete_pk: number,
  }

export interface GearBike {
    ref_id: string,
    name: string,
}

export interface Gear {
    pk: number,
    name: string,
    distance: number,
    distance_milestone: number,
    moving_time: number,
    moving_time_milestone: number,
    is_tracked: boolean,
    bikes: GearBike[],
}

export interface Athlete {
    pk: number,
    firstname: string,
    lastname: string,
    distance_unit: string,
    time_unit: string,
    gear: Gear[],
}

interface ResponseError {
    type: string,
    message: string,
    data: string,
    code: string,
}

const ErrorEnabledFetch: Promised<any> = async(fetchFunc: () => {}) => {
    try {
        const result = await fetchFunc()
        return result
    } catch(e)  {
        return handleResponseError(e)
    }
}

const handleResponseError = (e: ResponseError) => {
    alert(e.message)
    return new Promise((resolve, reject) => resolve([]))
}

const fetchJson: Promised<any> = async(url: string) => {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
        return json
    }
    const responseError = {
        type: json.type || '',
        message: json.message || json.detail || '',
        data: json.data || '',
        code: json.code || '',
    }

    let resError = new Error()
    resError = { ...resError, ...responseError }
    
    throw(resError)
}

const fetchJsonWithErrorHandling = async(url:string) => ErrorEnabledFetch(() => fetchJson(url))

export const fetchAuthorizationStatus: Promised<Authorized> = () => fetchJsonWithErrorHandling(urls.authorizedUrl)
