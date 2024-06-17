from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from django.db.models import Q
from smapp.models.messaging import Message
from smapp.models.profile import Profile
from smapp.serializers.messaging import MessageSerializer


#http routes for bulk message fetching on initial load
class MessageList(generics.ListCreateAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=MessageSerializer
    def get_queryset(self):
        # query params are expected
        sender = self.request.query_params.get("sender")
        receiver = self.request.query_params.get("receiver")
        if sender and receiver:
            sender_instance = Profile.objects.get(profile_name=sender)
            receiver_instance = Profile.objects.get(profile_name=receiver)
            criterion1 = Q(sender=sender_instance.id)
            criterion2 = Q(receiver=receiver_instance.id)
            criterion3 = Q(sender=receiver_instance.id)
            criterion4 = Q(receiver=sender_instance.id)
            queryset1 = Message.objects.filter(criterion1 & criterion2)
            queryset2 = Message.objects.filter(criterion3 & criterion4)
            return queryset2.union(queryset1)
        else:
            return None