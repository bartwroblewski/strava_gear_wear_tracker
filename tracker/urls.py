from django.urls import path, include

from . import views

app_name = 'tracker'
urlpatterns = [
    path('index', views.index, name='index'),
    path('authorize', views.authorize, name='authorize'),
    path('sessionize_tokendata', views.sessionize_tokendata, name='sessionize_tokendata'),
    path('tokendata', views.tokendata, name='tokendata'),
    path('show_activity', views.show_activity, name='show_activity'),
    path('handle_new_activity_creation', views.handle_new_activity_creation, name='handle_new_activity_creation'),
    path('user_gear', views.GearViewSet.as_view({'get': 'list'}), name='user_gear'),
    path('toggle_gear_tracking/<str:gear_name>', views.toggle_gear_tracking, name='toggle_gear_tracking'),
    path('delete_gear/<str:gear_name>', views.delete_gear, name='delete_gear'),
    path('add_gear', views.add_gear, name='add_gear'),
    path('', views.react, name='react'),
    
    
]