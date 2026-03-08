from django.urls import path
from .views import *

urlpatterns = [
    path('', GetAllSongView.as_view(), name='songs-list'),
    path('featured/', GetFeaturedView.as_view(), name='songs-featured'),
    path('made-for-you/', GetMadeForYouView.as_view(), name='songs-made-for-you'),
    path('trending/', GetTrendingView.as_view(), name='songs-trending'),
    path('search/', SearchSongsView.as_view(), name='songs-search'),
    path('liked/users/<uuid:userId>/', GetUserLikedSongView.as_view(), name='user-liked-songs'),
    path('users/<uuid:userId>/', UserSongsView.as_view(), name='user-songs'),
    path('<uuid:songId>/', SongDetailView.as_view(), name='song-detail'),
    path('<uuid:songId>/download/', DownloadSongView.as_view(), name='song-download'),
    path('<uuid:songId>/views/', IncreaseSongViewView.as_view(), name='song-views'),
    path('<uuid:songId>/likes/<uuid:userId>/', LikeSongView.as_view(), name='song-like'),
    path('<uuid:songId>/albums/<uuid:albumId>/', AddSongToAlbumView.as_view(), name='song-album'),
    path('<uuid:songId>/users/<uuid:userId>/', DeleteSongView.as_view(), name='song-delete'),
    path('<uuid:songId>/users/<uuid:userId>/albums/<uuid:albumId>/', DeleteSongView.as_view(), name='song-delete-album'),
]
