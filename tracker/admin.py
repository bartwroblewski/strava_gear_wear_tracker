from django.contrib import admin

from .models import Gear, Athlete, TokenData
# Register your models here.
admin.site.register(Gear)
admin.site.register(Athlete)
admin.site.register(TokenData)