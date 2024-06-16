from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from smapp.models.comment import Comment
from smapp.serializers.comment import CommentSerializer

#will only be used for POST, so no risk in objects.all()
class CommentList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
