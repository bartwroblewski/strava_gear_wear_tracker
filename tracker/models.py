from django.db import models
from django.contrib.auth import get_user_model

def unique_gear_name_validator(gear_name):
    pass

# Create your models here.

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)

class Gear(models.Model):
    name = models.CharField(max_length=200)
    mileage = models.FloatField(default=0)
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1)

