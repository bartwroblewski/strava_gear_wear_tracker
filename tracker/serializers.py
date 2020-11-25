from rest_framework import serializers

from .models import Athlete, Gear, Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['ref_id', 'name', 'athlete']

class GearSerializer(serializers.ModelSerializer):
    bikes = BikeSerializer(many=True)
    #athlete = AthleteSerializer()
    class Meta:
        model = Gear
        fields = [
            'pk',
            'name',
            'distance',
            'distance_in_athlete_unit',
            'distance_milestone',
            'distance_milestone_in_athlete_unit',
            'distance_remaining_to_milestone',
            'moving_time', 
            'moving_time_milestone',
            'moving_time_remaining_to_milestone',
            'duration',
            'is_tracked', 
            #'athlete', 
            'bikes',
        ]

class AthleteSerializer(serializers.ModelSerializer):
    gear = GearSerializer(many=True)
    class Meta:
        model = Athlete
        fields = ['pk', 'firstname', 'lastname', 'distance_unit', 'time_unit', 'gear']

