import requests

from django.conf import settings

CLIENT_ID = 53702
CLIENT_SECRET = '44ffd69ab0611f846b7970b3806640c617eb8127'
SCOPE = 'activity:read_all,read_all'

def get_authorization_url(after_auth_url):
    if settings.DOMAIN == 'localhost':
        domain = f'http://{settings.DOMAIN}:8000'
    else:
        domain = f'http://{settings.DOMAIN}'
    return (
        'http://www.strava.com/oauth/authorize?'
        f'client_id={CLIENT_ID}&response_type=code&'
        f'redirect_uri={domain}{after_auth_url}&approval_prompt=force&'
        f'scope={SCOPE}'
    )

def exchange_code_for_tokendata(code):
    url = 'https://www.strava.com/oauth/token'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
    }
    r = requests.post(url, params=params)
    tokendata = r.json()
    return tokendata

def get_activity(activity_id, access_token):
    url = f'https://www.strava.com/api/v3/activities/{activity_id}'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    r = requests.get(url, headers=headers)
    activity = r.json()
    return activity