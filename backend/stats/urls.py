from django.urls import path
from .views import *

urlpatterns = [
    path('', getGeneralStatView.as_view(), name='stats-general'),
    path('songs/popular/', getPopularSongsStatView.as_view(), name='stats-popular-songs'),
    path('artists/top/', getTopArtistsStatView.as_view(), name='stats-top-artists'),
]