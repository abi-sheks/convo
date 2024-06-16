from django.db import models
from django.core.validators import validate_slug
import uuid
from smapp.models.profile import Profile


class Post(models.Model):
    poster = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    caption = models.CharField(max_length=128)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    likers = models.ManyToManyField(Profile, related_name='likes', blank=True)
    img = models.ImageField(upload_to='images/', null=True, blank=True)