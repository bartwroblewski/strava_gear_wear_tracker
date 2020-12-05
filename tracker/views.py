import os
import json
import time

import requests

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.shortcuts import render, redirect
from django.urls import reverse, reverse_lazy
from django.core.serializers import serialize
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated, NotFound, PermissionDenied
from rest_framework import status
from rest_framework.decorators import api_view

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
    Include authorized athlete pk in the response.
    '''
    response = lambda x, y: JsonResponse({'authorized': x, 'athlete_pk': y})
    tokendata = request.session.get('tokendata')
    if tokendata:
        expired = time.time() > tokendata['expires_at']
        if not expired:
            athlete_id = tokendata['athlete']['id']
            athlete = Athlete.objects.get(ref_id=athlete_id)
            return response(True, athlete.pk)
    return response(False, None)

def athlete_detail(request, pk):
    athlete = get_object_or_404(Athlete, pk=pk)

    if request.method == 'GET':
        serializer = AthleteSerializer(athlete)
        return JsonResponse(serializer.data)

    elif request.method == "POST":
        form = AthleteForm(json.loads(request.body), instance=athlete)
        if form.is_valid():
            form.save()
            return HttpResponse(status=201)

    elif request.method == 'DELETE':
        #athlete.delete()
        return HttpResponse(status=204)

'''def gear_detail(request, pk):
    gear = get_object_or_404(Gear, pk=pk)

    if request.method == "POST":
        body = json.loads(request.body)
        form = GearForm(body, instance=gear)
        if form.is_valid():
            gear = form.save()
            bike_ids = body.get('bike_ids')
            if bike_ids:
                gear.bikes.clear()
                for bike_id in bike_ids:
                    bike = Bike.objects.get(ref_id=bike_id)
                    gear.bikes.add(bike)
            return HttpResponse(status=201)

    elif request.method == 'DELETE':
        gear.delete()
        return HttpResponse(status=204)'''

@api_view(['GET', 'POST'])
def gear_list(request):
    """
    List all gear or create new gear.
    """
    if request.method == 'GET':
        gear = Gear.objects.all()
        serializer = GearSerializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        athlete_id = request.session['tokendata']['athlete']['id'] # better to send the id from frontend...
        athlete = Athlete.objects.get(ref_id=athlete_id)
        serializer = GearSerializer(data=request.data)
        if serializer.is_valid():
            gear = serializer.save(athlete=athlete)
            bike_ids = request.data.get('bikes')
            gear.bikes.clear()
            for bike_id in bike_ids:
                bike = Bike.objects.get(ref_id=bike_id)
                gear.bikes.add(bike)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def gear_detail(request, pk):
    """
    Retrieve, update or delete gear.
    """
    gear = get_object_or_404(Gear, pk=pk)

    if request.method == 'GET':
        serializer = GearSerializer(gear)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GearSerializer(gear, data=request.data)
        if serializer.is_valid():
            serializer.save()
            bike_ids = request.data.get('bikes')
            gear.bikes.clear()
            for bike_id in bike_ids:
                bike = Bike.objects.get(ref_id=bike_id)
                gear.bikes.add(bike)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        gear.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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