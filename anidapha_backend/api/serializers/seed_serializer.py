from rest_framework import serializers
from api.models import Seed

class SeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seed
        fields = '__all__'
