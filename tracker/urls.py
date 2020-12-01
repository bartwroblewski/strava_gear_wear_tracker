from django.urls import path, include

from . import views

app_name = 'tracker'
urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('sessionize_tokendata', views.sessionize_tokendata, name='sessionize_tokendata'),
    path('athlete', views.AthleteViewSet.as_view({'get': 'list'}), name='athlete'),
    path('toggle_gear_tracking/<str:gear_name>', views.toggle_gear_tracking, name='toggle_gear_tracking'),
    path('delete_gear/<int:gear_pk>', views.delete_gear, name='delete_gear'),
    path('add_or_change_gear', views.add_or_change_gear, name='add_or_change_gear'),
    path('change_athlete_field', views.change_athlete_field, name='change_athlete_field'),
    path('subscribe', views.subscribe, name='subscribe'),
    path('callback', views.callback, name='callback'),
    path('view_subscription', views.view_subscription, name='view_subscription'),
    path('delete_subscription', views.delete_subscription, name='delete_subscription'),
    path('mock_callback_post', views.mock_callback_post, name='mock_callback_post'),
    path('receive_mock', views.receive_mock, name='receive_mock'),
    path('get_authorization_status', views.get_authorization_status, name='get_authorization_status'),
    path('refresh_athlete_bikes', views.refresh_athlete_bikes, name='refresh_athlete_bikes'),
    path('flush_session', views.flush_session, name='flush_session'),
    path('test1', views.test1, name='test1'),
    path('test2', views.test2, name='test2'),
    path('', views.index, name='index'),
    
    
]