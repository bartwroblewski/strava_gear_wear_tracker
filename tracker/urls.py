from django.urls import path, include

from . import views

app_name = 'tracker'
urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('get_authorization_status', views.get_authorization_status, name='get_authorization_status'),
    path('sessionize_tokendata', views.sessionize_tokendata, name='sessionize_tokendata'),
    path('athlete/<int:pk>', views.athlete_detail, name='athlete_detail'),
    path('gear', views.gear_list, name='gear_list'),
    path('gear/<int:pk>', views.gear_detail, name='gear_detail'),
    path('subscribe_to_strava_webhook', views.subscribe_to_strava_webhook, name='subscribe_to_strava_webhook'),
    path('strava_webhook_callback', views.strava_webhook_callback, name='strava_webhook_callback'),
    path('view_webhook_subscription', views.view_webhook_subscription, name='view_webhook_subscription'),
    path('unsubscribe_to_strava_webhook', views.unsubscribe_to_strava_webhook, name='unsubscribe_to_strava_webhook'),
    path('mock_callback_post', views.mock_callback_post, name='mock_callback_post'),
    path('receive_mock', views.receive_mock, name='receive_mock'),
    path('flush_session', views.flush_session, name='flush_session'),
    path('', views.index, name='index'),   
]