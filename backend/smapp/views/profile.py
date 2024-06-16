from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework.views import APIView
from smapp.models.profile import Profile
from smapp.serializers.profile import ProfileSerializer, ProfilePicSerializer

class ProfileList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    def get_queryset(self):
        uname = self.request.query_params.get("profileName")
        queryset = Profile.objects.filter(profile_name__contains=uname)
        return queryset

class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'profile_name'
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ProfilePicView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'profile_name'
    queryset = Profile
    serializer_class = ProfilePicSerializer