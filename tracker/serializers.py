from rest_framework import serializers

from .models import Gear, Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['ref_id', 'name', 'athlete']

class GearSerializer(serializers.ModelSerializer):
    bikes = BikeSerializer(many=True)
    class Meta:
        model = Gear
        fields = ['pk', 'name', 'mileage', 'is_tracked', 'athlete', 'bikes']

