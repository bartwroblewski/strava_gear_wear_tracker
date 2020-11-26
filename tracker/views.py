import os
import json
import time

import requests

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.serializers import serialize
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


from rest_framework import viewsets
from rest_framework.exceptions import NotAuthenticated, NotFound, PermissionDenied

from .models import Gear, Athlete, TokenData, Bike
from .serializers import GearSerializer, AthleteSerializer

from .api import (
    get_authorization_url,
    exchange_code_for_tokendata, 
    get_activity,
    CLIENT_ID, 
    CLIENT_SECRET,
    get_authenticated_athlete,
)

# Create your views here.
def index(request):
    return HttpResponse('ok')#render(request, 'frontend/index.html')

def authorize(request):
    after_auth_url=reverse('tracker:sessionize_tokendata')
    authorization_url = get_authorization_url(after_auth_url)
    return redirect(authorization_url)

def sessionize_tokendata(request):
    code = request.GET.get('code')
    tokendata = exchange_code_for_tokendata(code)

    # update tokendata pseudo-singleton
    tokendata_db = TokenData.objects.first()
    tokendata_db.expires_in=tokendata['expires_in']
    tokendata_db.expires_at=tokendata['expires_at']
    tokendata_db.access_token=tokendata['access_token']
    tokendata_db.refresh_token=tokendata['refresh_token']
    tokendata_db.save()
    
    # create or get athlete
    athlete, created = Athlete.objects.get_or_create(
        ref_id=tokendata['athlete']['id'],
        firstname=tokendata['athlete']['firstname'],
        lastname=tokendata['athlete']['lastname'],
    )
    athlete_data = get_authenticated_athlete(tokendata['access_token'])
    athlete_bikes = athlete_data.get('bikes')
    if athlete_bikes:
        for b in athlete_bikes:
            bike, created = Bike.objects.get_or_create(
                ref_id=b['id'],
                name=b['name'],
                athlete=athlete,
            )
        
    print('BIKES', athlete_bikes)

    request.session['tokendata'] = tokendata

    return redirect(reverse('tracker:react'))

def refresh_athlete_bikes(request):
    tokendata = request.session['tokendata'] 
    athlete, created = Athlete.objects.get_or_create(
        ref_id=tokendata['athlete']['id'],
        firstname=tokendata['athlete']['firstname'],
        lastname=tokendata['athlete']['lastname'],
    )
    athlete_data = get_authenticated_athlete(tokendata['access_token'])
    athlete_bikes = athlete_data.get('bikes')
    if athlete_bikes:
        for b in athlete_bikes:
            bike, created = Bike.objects.get_or_create(
                ref_id=b['id'],
                name=b['name'],
                athlete=athlete,
            )
    return JsonResponse(athlete_bikes, safe=False)

def tokendata(request):
    response = {'tokendata': request.session['tokendata']}
    return JsonResponse(response)

def show_activity(request):
    access_token = request.session['tokendata']['access_token']
    activity_id = 4067853651
    activity = get_activity(activity_id, access_token)
    response = {'activity': activity}
    return JsonResponse(response)

# this is where Strava webhook event will post activity id once activity is created
def handle_new_activity_creation(request):
    return HttpResponse('OK')

def react(request):
    return render(request, 'frontend/index.html')
    """ path = os.path.join(
        settings.REACT_APP_DIR,
        'build',
        'index.html',
    )
    with open(path) as f:
        return HttpResponse(f.read()) """

class GearViewSet(viewsets.ModelViewSet):
    serializer_class = GearSerializer

    def get_queryset(self):
        try:
            athlete_id = self.request.session['tokendata']['athlete']['id']
        except KeyError:
            # if no token in session, athlete did not authorize with Strava yet
            raise NotAuthenticated
        athlete = Athlete.objects.get(ref_id=athlete_id)
        athlete_gear = Gear.objects.filter(athlete=athlete)
        return athlete_gear

class AthleteViewSet(viewsets.ModelViewSet):
    serializer_class = AthleteSerializer

    def get_queryset(self):
        try:
            athlete_id = self.request.session['tokendata']['athlete']['id']
        except KeyError:
            # if no token in session, athlete did not authorize with Strava yet
            raise NotAuthenticated
        athlete = Athlete.objects.filter(ref_id=athlete_id)
        return athlete
        
def toggle_gear_tracking(request, gear_name):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    gear = Gear.objects.get(athlete=athlete, name=gear_name)
    gear.is_tracked = not gear.is_tracked
    gear.save()
    return HttpResponse('OK')

def delete_gear(request, gear_pk):
    gear = Gear.objects.get(pk=gear_pk)
    gear.delete()
    return HttpResponse('OK')

def add_or_change_gear(request):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    pk = request.GET.get('pk')
    name = request.GET.get('name')
    distance = float(request.GET.get('distance'))
    distance_milestone = float(request.GET.get('distance_milestone'))
    moving_time = request.GET.get('time')
    moving_time_milestone = request.GET.get('time_milestone')
    is_tracked = json.loads(request.GET.get('track'))
    bike_ids = request.GET.get('bike_ids')

    try:
        gear = Gear.objects.get(pk=pk)
    except Gear.DoesNotExist:
        gear = Gear()
        gear.athlete = athlete  
        
    gear.name = name
    gear.distance = distance
    gear.distance_milestone = distance_milestone
    gear.moving_time  = moving_time
    gear.moving_time_milestone = moving_time_milestone
    gear.is_tracked = is_tracked

    try:
        gear.full_clean() # validate gear uniqueness per athlete
    except ValidationError as e:
        return HttpResponseServerError('; '.join(e.messages))

    gear.save()

    if bike_ids:
        gear.bikes.clear()
        for bike_id in bike_ids.split(','):
            bike = Bike.objects.get(ref_id=bike_id)
            gear.bikes.add(bike)
    return HttpResponse('OK')

def change_athlete_field(request):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    field = request.GET.get('field')
    value = request.GET.get('value')

    setattr(athlete, field, value)
    athlete.save()

    return HttpResponse(getattr(athlete, field))

def subscribe(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'callback_url': f'http://{settings.DOMAIN}/callback',
        'verify_token': 'STRAVA',
    }
    r = requests.post(url, params=params)
    return HttpResponse(r.text)

def mock_callback_post(request):
    url = request.build_absolute_uri(reverse('tracker:callback'))
    print(url)
    r = requests.post(url, json={'object_id': '4320742434', 'owner_id': '5303167'})
    return HttpResponse(r.text)

@csrf_exempt
def receive_mock(request):
    print(request.body)
    return HttpResponse('OK')

@csrf_exempt # allow Strava webhook event POST request
def callback(request):
    print('CALLBACK REQUEST METHOD: ', request.method)
    # This url is called by Strava either on creating the subscription 
    # or when webhook event occurs
    if request.method == 'GET':
        hub_challenge = request.GET.get('hub.challenge')
        # if callback called while creating a webhook subsription,
        # just echo hub.challenge in the response
        verify_token = request.GET.get('hub.verify_token')
        print(f'VERIFY TOKEN: {verify_token}')
        response = {
            'hub.challenge': hub_challenge,
        }
        return JsonResponse(response)
    if request.method == 'POST':
        body = json.loads(request.body)

        access_token = TokenData.objects.first().access_token
        activity_id = body['object_id']
        activity = get_activity(activity_id, access_token)

        #increase the distance of all tracked gear by the activity distance
        athlete_id = body['owner_id']
        athlete = Athlete.objects.get(ref_id=athlete_id)

        bike_id = activity['gear_id']       
        try:
            bike = Bike.objects.get(ref_id=bike_id)
        except Bike.DoesNotExist:
            bike = None

        tracked_athlete_gear = Gear.objects.filter(
            athlete=athlete, 
            is_tracked=True,
            bikes=bike,
        )

        for gear in tracked_athlete_gear:
            gear.distance += activity['distance']
            gear.moving_time += activity['moving_time']
            gear.elapsed_time += activity['elapsed_time']
            gear.save()
            gear.send_milestone_notifications()
        return HttpResponse('OK')

def view_subscription(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.get(url, params=params)
    return HttpResponse(r.json())

def delete_subscription(request):
    id = request.GET.get('id')
    url = f'https://www.strava.com/api/v3/push_subscriptions/{id}'
    params = {
        'id': id,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.delete(url, params=params)
    return HttpResponse(r.text)

def get_authorization_status(request):
    '''Check if:
        1. Token is in session (i.e. user has authorized already);
        2. The token is not expired.
    '''
    authorized = lambda x: JsonResponse({'authorized': x})
    tokendata = request.session.get('tokendata')
    if tokendata:
        expired = token_expired(tokendata)
        if not expired:
            return authorized(True)
    return authorized(False)

def token_expired(tokendata):
    return time.time() > tokendata['expires_at'] 

def view_session(request):
    print(request.body)
    response = dict(
        session=dict(request.session.items())
    )
    return JsonResponse(response)

def flush_session(request):
    request.session.flush()
    return redirect(reverse('tracker:view_session'))

def test(request):
    todos = [
        {'id': 1, 'text': 'clean house'},
        {'id': 2, 'text': 'go shopping'},
        {'id': 3, 'text': 'do work'},
    ]
    response = {'todos': todos}
    return JsonResponse(response, safe=False)

