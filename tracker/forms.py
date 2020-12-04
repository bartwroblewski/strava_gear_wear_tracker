from django import forms

from .models import Athlete, Gear

class AthleteForm(forms.ModelForm):
    class Meta:
        model = Athlete
        fields = ['firstname']

class GearForm(forms.ModelForm):
    class Meta:
        model = Gear
        fields = ['name']