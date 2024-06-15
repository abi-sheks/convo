from django.db import models
from django.core.validators import validate_slug
import uuid
from django.contrib.auth.models import User 


class Profile(models.Model):
    user= models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    id =models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile_name = models.SlugField(default='', null = False, validators=[validate_slug])
    following = models.ManyToManyField("self", related_name="followers", blank=True, symmetrical=False)

    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        self.profile_name = self.user.username
        super(Profile, self).save(*args, **kwargs)