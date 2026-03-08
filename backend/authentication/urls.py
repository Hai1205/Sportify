from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/', LoginWithGoogleView.as_view(), name='google-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('roles/admin/', CheckAdmin.as_view(), name='check-admin'),
    path('roles/artist/', CheckArtist.as_view(), name='check-artist'),
    path('passwords/<uuid:userId>/', ChangePasswordView.as_view(), name='change-password'),
    path('passwords/forgot/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('passwords/<uuid:userId>/reset/', ResetPasswordView.as_view(), name='reset-password'),
    path('otp/<str:email>/verify/', CheckOTPView.as_view(), name='verify-otp'),
    path('otp/<str:email>/', SendOTPView.as_view(), name='send-otp'),
]
