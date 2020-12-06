import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface Resource {
    pk: number,
    //other optional here...
}

const create = async(url: string, payload: Resource) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    const status = await response.status
    return status
}

const retrieve = async(url: string, pk: number): Promise<Resource> => {
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

const update = async(url: string, payload: Resource) => {
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
    const status = await response.status
    return status
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
    const status = await response.status
    return status
}

const crud = (url: string) => {
    return {
        create: (payload: Resource) => create(url, payload),
        retrieve: (pk: number) => retrieve(url, pk),
        update: (payload: Resource) => update(url, payload),
        del: (pk: number) => del(url, pk),
    }
}

export const athleteCrud = crud(urls.athleteUrl)
export const gearCrud = crud(urls.gearUrl)

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
