from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from smapp.serializers.user import UserSerializer
from smapp.serializers.profile import ProfileSerializer
from smapp.models.profile import Profile


class WhoamiView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(data={'username' : request.user.username, 'email' : request.user.email}, status=status.HTTP_200_OK)
class RegisterView(APIView):
    permission_classes = [AllowAny, ]
    def get(self, request):
        ...
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            username = user_serializer.data['username']
            email = user_serializer.data['email']
            return Response(data={'username' : username, 'email' : email}, status=status.HTTP_200_OK)
        else:
            return Response(data={'err' : 'INVALID CREDENTIALS.'}, status=status.HTTP_400_BAD_REQUEST)
        
class LoginView(APIView):
    permission_classes = [AllowAny, ]
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = None
            user = authenticate(username=user_serializer.data['username'], password=user_serializer.data['password'])
            print(user)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response(data=
                                {
                                    'token': token.key, 
                                    'username' : user_serializer.data['username'], 
                                    'email' : user_serializer.data['email']
                                }, 
                                 status=status.HTTP_200_OK)
            else:
                return Response(data={'err' : 'INVALID CREDENTIALS.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={'err' : 'INVALID CREDENTIALS.'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
            return Response({'msg': 'LOGGED OUT SUCCESSFULLY.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'err': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

