from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.urlpatterns import format_suffix_patterns
from smapp.views.auth import RegisterView, LoginView, LogoutView



urlpatterns = [
    path('auth/register/', csrf_exempt(RegisterView)),
    path('auth/login/', csrf_exempt(LoginView)),
    path('auth/logout/', csrf_exempt(LogoutView))
]

urlpatterns = format_suffix_patterns(urlpatterns)


