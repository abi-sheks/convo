from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from smapp.models.post import Post
from smapp.serializers.post import PostSerializer

class PostList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all()

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer