from django.contrib import admin

from .models import Gear, Athlete, Bike, TokenData
# Register your models here.
admin.site.register(Gear)
admin.site.register(Athlete)
admin.site.register(TokenData)
admin.site.register(Bike)