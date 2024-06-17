from django.contrib import admin
from smapp.models.profile import Profile
from smapp.models.post import Post
from smapp.models.comment import Comment
from smapp.models.messaging import Message

# Register your models here.
admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Message)