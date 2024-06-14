from smapp.models.profile import Profile
from smapp.serializers.user import UserSerializer
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Profile
        fields = ['user', 'id']