from rest_framework import serializers
from api.models import Plot

class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = '__all__'
