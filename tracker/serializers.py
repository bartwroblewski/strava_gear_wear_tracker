from rest_framework import serializers

from .models import Athlete, Gear, Bike

class AthleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Athlete
        fields = ['pk', 'distance_unit', 'time_unit']

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['ref_id', 'name', 'athlete']

class GearSerializer(serializers.ModelSerializer):
    bikes = BikeSerializer(many=True)
    athlete = AthleteSerializer()
    class Meta:
        model = Gear
        fields = ['pk', 'name', 'mileage', 'moving_time', 'is_tracked', 'athlete', 'bikes']

