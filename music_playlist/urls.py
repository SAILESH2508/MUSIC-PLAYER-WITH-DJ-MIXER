from django.urls import path
from . import api_views

urlpatterns = [
    # API Routes
    path('api/songs/', api_views.SongListCreateAPI.as_view(), name='api_song_list_create'),
    path('api/songs/<int:pk>/', api_views.SongDetailAPI.as_view(), name='api_song_detail'),
    path('api/register/', api_views.RegisterAPI.as_view(), name='api_register'),
    path('api/login/', api_views.LoginAPI.as_view(), name='api_login'),
    path('api/user/', api_views.UserDetailAPI.as_view(), name='api_user_detail'),
]