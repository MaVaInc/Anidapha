from rest_framework import serializers
from .models import Seed



class SeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seed
        fields = '__all__'