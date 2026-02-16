from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import AppleLoginView, GoogleLoginView, HealthView, MeView

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("google/", GoogleLoginView.as_view(), name="google-login"),
    path("apple/", AppleLoginView.as_view(), name="apple-login"),
    path("me/", MeView.as_view(), name="me"),
    path("", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
]
