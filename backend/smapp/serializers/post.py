from smapp.models.post import Post
from smapp.models.profile import Profile
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from smapp.serializers.comment import CommentSerializer
from smapp.models.profile import Profile
import base64

class PostSerializer(serializers.ModelSerializer):
    img = Base64ImageField(required=False)
    #comments will be separately created, but will be sent back from here for easy access
    comment_set = CommentSerializer(read_only=True,many=True, required=False)
    likers = serializers.SlugRelatedField(many=True, required=False, slug_field="profile_name", queryset=Profile.objects.all())
    poster = serializers.SlugRelatedField(required=False, slug_field="profile_name", queryset=Profile.objects.all())

    class Meta:
        model = Post
        fields = [ 'id', 'img', 'poster', 'likers', 'comment_set', 'caption']
