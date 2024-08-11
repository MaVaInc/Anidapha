from rest_framework import viewsets
from .models import *
from .serializers import YourModelSerializer

class YourModelViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = YourModelSerializer
