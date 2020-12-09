from django.urls import path, include

from . import views

app_name = 'tracker'
urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('get_authorization_status', views.get_authorization_status, name='get_authorization_status'),
    path('sessionize_tokendata', views.sessionize_tokendata, name='sessionize_tokendata'),
    path('athlete/<int:pk>', views.AthleteDetail.as_view(), name='athlete_detail'),
    path('gear', views.GearList.as_view(), name='gear_list'),
    path('gear/<int:pk>', views.GearDetail.as_view(), name='gear_detail'),
    path('subscribe_to_strava_webhook', views.subscribe_to_strava_webhook, name='subscribe_to_strava_webhook'),
    path('strava_callback', views.strava_callback, name='strava_callback'),
    path('view_webhook_subscription', views.view_webhook_subscription, name='view_webhook_subscription'),
    path('unsubscribe_to_strava_webhook', views.unsubscribe_to_strava_webhook, name='unsubscribe_to_strava_webhook'),
    path('mock_callback_post', views.mock_callback_post, name='mock_callback_post'),
    path('receive_mock', views.receive_mock, name='receive_mock'),
    path('logout', views.logout, name='logout'),
    path('', views.index, name='index'),   
] 