from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'get_athlete', views.AthleteViewSet, basename='athlete')

app_name = 'tracker'
urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('get_authorization_status', views.get_authorization_status, name='get_authorization_status'),
    path('sessionize_tokendata', views.sessionize_tokendata, name='sessionize_tokendata'),
    #path('get_athlete', views.AthleteViewSet.as_view({'get': 'list'}), name='get_athlete'),
    path('athlete/<int:pk>', views.athlete, name='athlete'),
    path('change_athlete_field', views.change_athlete_field, name='change_athlete_field'),
    path('delete_gear/<int:gear_pk>', views.delete_gear, name='delete_gear'),
    path('add_or_change_gear', views.add_or_change_gear, name='add_or_change_gear'),
    path('subscribe_to_strava_webhook', views.subscribe_to_strava_webhook, name='subscribe_to_strava_webhook'),
    path('strava_webhook_callback', views.strava_webhook_callback, name='strava_webhook_callback'),
    path('view_webhook_subscription', views.view_webhook_subscription, name='view_webhook_subscription'),
    path('unsubscribe_to_strava_webhook', views.unsubscribe_to_strava_webhook, name='unsubscribe_to_strava_webhook'),
    path('mock_callback_post', views.mock_callback_post, name='mock_callback_post'),
    path('receive_mock', views.receive_mock, name='receive_mock'),
    path('flush_session', views.flush_session, name='flush_session'),
    path('', views.index, name='index'),   
]

urlpatterns += router.urls