from smapp.models.messaging import Message
from smapp.models.profile import Profile
from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from smapp.utils import serialize_datetime



class MessageConsumer(WebsocketConsumer):
    def connect(self):
        self.sender= self.scope['url_route']['kwargs']['sender']
        self.receiver = self.scope['url_route']['kwargs']['receiver']
        print("right right lesgo")
        #to maintain homogenity in room name
        if self.sender > self.receiver:
            first = self.receiver
            self.receiver = self.sender
            self.sender = first
        self.room_group_name = f'chat_{self.sender}_{self.receiver}'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        sender = self.scope['url_route']['kwargs']['sender']
        receiver = self.scope['url_route']['kwargs']['receiver']
        #probably would get sql injected but oh well
        print(f"the text data is {text_data}")
        sender_instance = Profile.objects.get(profile_name=sender)
        receiver_instance = Profile.objects.get(profile_name=receiver)
        message = Message.objects.create(sender=sender_instance, receiver=receiver_instance, content=text_data)
        print(message)
        message_response = {
            'content' : text_data,
            'sender' : sender,
            'receiver' : receiver,
            'id' : message.id,
            'timestamp' : message.timestamp,      
        }
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {
            'type': 'send_message',
            'message': json.dumps(message_response, default=serialize_datetime)
        }
    )

    def send_message(self, event):
        self.send(text_data=event['message'])