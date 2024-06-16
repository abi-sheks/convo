from django.db import models
from smapp.models.profile import Profile
from smapp.models.post import Post
import uuid

class Comment(models.Model):
    rel_post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    commenter = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    content = models.CharField(max_length=128)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)