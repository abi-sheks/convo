from smapp.models.profile import Profile
from smapp.serializers.user import UserSerializer
from rest_framework import serializers

class ProfileNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_name']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    following = serializers.SlugRelatedField(many=True, required = False, slug_field='profile_name', queryset=Profile.objects.all())
    followers = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'id', 'profile_name', 'following', 'followers']
    
    def get_followers(self, obj):
        profiles = obj.followers.all()
        profile_names = [profile.profile_name for profile in profiles]
        return profile_names