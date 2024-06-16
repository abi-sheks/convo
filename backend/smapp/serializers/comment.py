from rest_framework import serializers
from smapp.models.comment import Comment
from smapp.models.profile import Profile

class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SlugRelatedField(required = False, slug_field='profile_name', queryset=Profile.objects.all())
    class Meta:
        model=Comment
        fields = ['id', 'content', 'commenter']