import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

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
    bikes: GearBike[],
}

const create = async<T,>(url: string, payload: T) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    return handleResponse(response)
}

const retrieve = async<T,>(url: string, pk: number): Promise<T> => {
    const response = await fetch(url + '/' + pk)
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

const update = async<T,>(url: string, payload: T) => {
    const URL = url + `/${payload.pk}`
    const response = await fetch(URL, {
        method: 'PUT',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    return response
}

const del = async(url: string, pk: number) => {
    const URL = url + '/' + pk
    const response = await fetch(URL, {
        method: 'DELETE',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    return response
}

const handleResponse = async(response: any) => {
    const json = await response.json()
    if (response.ok) {
        return json
    } else {
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
}

const crud = <T,>(url: string) => {
    return {
        create: (payload: T) => create<T>(url, payload),
        retrieve: (pk: number) => retrieve<T>(url, pk),
        update: (payload: T) => update<T>(url, payload),
        del: (pk: number) => del(url, pk),
    }
}

const errorCrud = <T, >(url: string) => {
    const c = crud<T>(url)
}

export const athleteCrud = crud<Athlete>(urls.athleteUrl)
export const gearCrud = crud<Gear>(urls.gearUrl)

export const getAuthStatus: Promised<number> = async() => {
    const response = await fetch(urls.authorizedUrl)
    const json = await response.json()
    return json
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* interface ResponseError {
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

const fetchJsonWithErrorHandling = async(url:string) => ErrorEnabledFetch(() => fetchJson(url)) */