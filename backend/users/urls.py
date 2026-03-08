from django.urls import path
from .views import *

urlpatterns = [
    path('', UserListView.as_view(), name='users-list'),
    path('search/', SearchUsersView.as_view(), name='users-search'),
    path('artist-applications/', GetArtistApplications.as_view(), name='artist-applications-list'),
    path('artist-applications/<uuid:applicationId>/', ArtistApplicationDetailView.as_view(), name='artist-application-detail'),
    path('<uuid:userId>/', UserDetailView.as_view(), name='user-detail'),
    path('<uuid:userId>/songs/', getAllUserSongsView.as_view(), name='user-songs'),
    path('<uuid:userId>/followings/<uuid:opponentId>/', FollowUserView.as_view(), name='user-following'),
    path('<uuid:userId>/artist-applications/', UserArtistApplicationView.as_view(), name='user-artist-application'),
]
