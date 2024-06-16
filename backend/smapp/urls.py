from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.urlpatterns import format_suffix_patterns
from smapp.views.auth import RegisterView, LoginView, LogoutView, WhoamiView
from smapp.views.profile import ProfileList, ProfileDetail, ProfilePicView
from smapp.views.post import PostList, PostDetail
from smapp.views.comment import CommentList
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('auth/register/', csrf_exempt(RegisterView.as_view())),
    path('auth/login/', csrf_exempt(LoginView.as_view())),
    path('auth/logout/', csrf_exempt(LogoutView.as_view())),
    path('auth/whoami/', csrf_exempt(WhoamiView.as_view())),
    path('profiles/', csrf_exempt(ProfileList.as_view())),
    path('profiles/<slug:profile_name>/', csrf_exempt(ProfileDetail.as_view())),
    path('posts/', csrf_exempt(PostList.as_view())),
    path('posts/<slug:id>/', csrf_exempt(PostDetail.as_view())),
    #not proud of this one 
    path('pfp/<slug:profile_name>/', csrf_exempt(ProfilePicView.as_view())),
    path('comments/', csrf_exempt(CommentList.as_view()))
]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

