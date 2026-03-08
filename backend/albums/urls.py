from django.urls import path
from .views import *

urlpatterns = [
    path('', GetAllAlbumView.as_view(), name='albums-list'),
    path('search/', searchAlbums.as_view(), name='albums-search'),
    path('liked/users/<uuid:userId>/', GetUserLikedAlbumView.as_view(), name='user-liked-albums'),
    path('users/<uuid:userId>/', UserAlbumsView.as_view(), name='user-albums'),
    path('<uuid:albumId>/', AlbumDetailView.as_view(), name='album-detail'),
    path('<uuid:albumId>/likes/<uuid:userId>/', LikeSongView.as_view(), name='album-like'),
    path('<uuid:albumId>/users/<uuid:userId>/', DeleteAlbumView.as_view(), name='album-delete'),
]
