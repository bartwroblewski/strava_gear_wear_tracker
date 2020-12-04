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
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated, NotFound, PermissionDenied

from .models import Gear, Athlete, TokenData, Bike
from .forms import AthleteForm, GearForm
from .serializers import GearSerializer, AthleteSerializer

from .api import (
    get_authorization_url,
    exchange_code_for_tokendata, 
    get_activity,
    CLIENT_ID, 
    CLIENT_SECRET,
)

def index(request):
    return render(request, 'frontend/index.html')

def authorize(request):
    after_auth_url=reverse('tracker:sessionize_tokendata')
    authorization_url = get_authorization_url(after_auth_url)
    return redirect(authorization_url)

def sessionize_tokendata(request):
    '''Redirect URL for Strava auth mechanism.
    Receives code that can be exchanged for API access tokens.'''
    code = request.GET.get('code')
    tokendata = exchange_code_for_tokendata(code)
    TokenData.objects.first().update(tokendata) # update tokendata stored in DB with the new one receive
    request.session['tokendata'] = tokendata

    # upon receiving athlete ID from Strava,
    # sync athlete bikes to the ones on Strava.
    # This means that athlete bikes will be synced
    # only on login to app.
    athlete, created = Athlete.objects.get_or_create(
        ref_id=tokendata['athlete']['id'],
        firstname=tokendata['athlete']['firstname'],
        lastname=tokendata['athlete']['lastname'],
    )
    athlete.refresh_bikes(tokendata['access_token'])

    return redirect(reverse('tracker:index'))

def get_authorization_status(request):
    '''Check if:
        1. Token is in session (i.e. user has authorized already);
        2. The token is not expired.
    '''
    response = lambda x: JsonResponse({'authorized': x})
    tokendata = request.session.get('tokendata')
    if tokendata:
        expired = time.time() > tokendata['expires_at']
        if not expired:
            return response(True)
    return response(False)

class AthleteViewSet(viewsets.ModelViewSet):
    serializer_class = AthleteSerializer

    def get_queryset(self):
        try:
            athlete_id = self.request.session['tokendata']['athlete']['id']
        except KeyError:
            # if no token in session, athlete did not authorize with Strava yet - raise error
            raise NotAuthenticated
        athlete = Athlete.objects.filter(ref_id=athlete_id)
        return athlete

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        print('PARTIAL')
        pass

def athlete_detail(request, pk):
    try:
        athlete = Athlete.objects.get(pk=pk)
    except athlete.DoesNotExist:
        return HttpResponseServerError(status=404)

    if request.method == 'GET':
        serializer = AthleteSerializer(athlete)
        return JsonResponse(serializer.data)

    elif request.method == "POST":
        form = AthleteForm(json.loads(request.body), instance=athlete)
        if form.is_valid():
            form.save()

    elif request.method == 'DELETE':
        #athlete.delete()
        return HttpResponse(status=204)

def gear_detail(request, pk):
    try:
        gear = Gear.objects.get(pk=pk)
    except gear.DoesNotExist:
        return HttpResponseServerError(status=404)

    if request.method == "POST":
        form = GearForm(json.loads(request.body), instance=gear)
        if form.is_valid():
            form.save()

    elif request.method == 'DELETE':
        #gear.delete()
        return HttpResponse(status=204)


def change_athlete_field(request):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    field = request.GET.get('field')
    value = request.GET.get('value')

    setattr(athlete, field, value)
    athlete.save()

    return HttpResponse(getattr(athlete, field))
 
def add_or_change_gear(request):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    pk = request.GET.get('pk')
    try:
        gear = Gear.objects.get(pk=pk)
    except Gear.DoesNotExist:
        gear = Gear()
        gear.athlete = athlete  
        
    gear.name = request.GET.get('name')
    gear.distance = float(request.GET.get('distance'))
    gear.distance_milestone = float(request.GET.get('distance_milestone'))
    gear.moving_time  = request.GET.get('time')
    gear.moving_time_milestone = request.GET.get('time_milestone')
    gear.is_tracked = json.loads(request.GET.get('track'))

    try:
        gear.full_clean() # validate gear uniqueness per athlete
    except ValidationError as e:
        return HttpResponseServerError('; '.join(e.messages))

    gear.save()

    bike_ids = request.GET.get('bike_ids')
    if bike_ids:
        gear.bikes.clear()
        for bike_id in bike_ids.split(','):
            bike = Bike.objects.get(ref_id=bike_id)
            gear.bikes.add(bike)
    return HttpResponse('OK')

def delete_gear(request, gear_pk):
    gear = Gear.objects.get(pk=gear_pk)
    gear.delete()
    return HttpResponse('OK')

@csrf_exempt # allow Strava webhook event POST request
def strava_webhook_callback(request):
    '''This url is called by Strava either on creating the subscription 
    or when webhook event occurs.'''
    if request.method == 'GET':
        hub_challenge = request.GET.get('hub.challenge')

        # if callback called while creating a webhook subsription,
        # just echo hub.challenge in the response
        verify_token = request.GET.get('hub.verify_token')
        response = {
            'hub.challenge': hub_challenge,
        }
        return JsonResponse(response)

    if request.method == 'POST':
        body = json.loads(request.body)

        access_token = TokenData.objects.first().access_token
        activity_id = body['object_id']
        activity = get_activity(activity_id, access_token)

        athlete_id = body['owner_id']
        athlete = Athlete.objects.get(ref_id=athlete_id)
        athlete.refresh_bikes(access_token)

        bike_id = activity['gear_id']       
        try:
            bike = Bike.objects.get(ref_id=bike_id)
        except Bike.DoesNotExist:
            bike = None

        # update only gear that has tracking enabled
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

def mock_callback_post(request):
    url = request.build_absolute_uri(reverse('tracker:strava_webhook_callback'))
    print(url)
    r = requests.post(url, json={'object_id': '4397165165', 'owner_id': '5303167'})
    return HttpResponse(r.text)

@csrf_exempt
def receive_mock(request):
    print(request.body)
    return HttpResponse('OK')

def subscribe_to_strava_webhook(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'callback_url': f'http://{settings.DOMAIN}/strava_webhook_callback',
        'verify_token': 'STRAVA',
    }
    r = requests.post(url, params=params)
    return HttpResponse(r.text)

def unsubscribe_to_strava_webhook(request):
    id = request.GET.get('id')
    url = f'https://www.strava.com/api/v3/push_subscriptions/{id}'
    params = {
        'id': id,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.delete(url, params=params)
    return HttpResponse(r.text)

def view_webhook_subscription(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.get(url, params=params)
    return HttpResponse(r.json())

def flush_session(request):
    request.session.flush()
    return HttpResponse('Session flushed!')