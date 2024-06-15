from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.urlpatterns import format_suffix_patterns
from smapp.views.auth import RegisterView, LoginView, LogoutView, WhoamiView
from smapp.views.profile import ProfileList, ProfileDetail



urlpatterns = [
    path('auth/register/', csrf_exempt(RegisterView.as_view())),
    path('auth/login/', csrf_exempt(LoginView.as_view())),
    path('auth/logout/', csrf_exempt(LogoutView.as_view())),
    path('auth/whoami/', csrf_exempt(WhoamiView.as_view())),
    path('profiles/', csrf_exempt(ProfileList.as_view())),
    path('profiles/<slug:profile_name>/', csrf_exempt(ProfileDetail.as_view()))
]

urlpatterns = format_suffix_patterns(urlpatterns)


