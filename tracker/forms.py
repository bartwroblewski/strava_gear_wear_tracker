from django import forms

from .models import Athlete, Gear

class AthleteForm(forms.ModelForm):
    class Meta:
        model = Athlete
        fields = ['distance_unit']

class GearForm(forms.ModelForm):
    class Meta:
        model = Gear
        fields = ['name']