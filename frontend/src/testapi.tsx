const domain: string =  'http://localhost:8000'//'http://f918bae6f5b0.ngrok.io'
export const athleteUrl: string = domain + '/athlete'

export const getAthlete = async(pk: number) => {
    const response = await fetch(athleteUrl + '/' + pk)
    const json = await response.json()
    return json
}

interface AthletePayload {
    pk: number,
    //other optional here...
}

export const changeAthlete = async(payload: AthletePayload) => {
    const url = athleteUrl + `/${payload.pk}`
    fetch(url, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
}

export const deleteAthlete = async(pk: number) => {
    const url = athleteUrl + '/' + pk
    fetch(url, {
        method: 'DELETE',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
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
