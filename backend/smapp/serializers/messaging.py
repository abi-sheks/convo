from smapp.models.messaging import Message
from smapp.models.profile import Profile
from rest_framework import serializers

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(required=False, slug_field="profile_name", queryset=Profile.objects.all())
    receiver = serializers.SlugRelatedField(required=False, slug_field="profile_name", queryset=Profile.objects.all())
    timestamp = serializers.DateTimeField(required=False)
    class Meta:
        model = Message
        fields = ['content', 'id', 'timestamp', 'sender', 'receiver']