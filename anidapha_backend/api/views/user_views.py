from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import User
from api.serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
def manifest_view(request):
    manifest = {
    "name": "Anidapha",
    "dappUrl": "https://t-mini-app.com/",
    "iconUrl": "https://t-mini-app.com/static/images/logo.png",
    "types": ["sendTransaction"],
    "permissions": ["ton_send"]
}
    return JsonResponse(manifest)