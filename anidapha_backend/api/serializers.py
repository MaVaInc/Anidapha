from rest_framework import serializers
from .models import User, Item, Plot


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['telegram_id', 'username', 'first_name', 'last_name', 'dogs_balance', 'auth_date', 'created_at','count_purchases']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        return User.objects.create(**validated_data)


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = '__all__'



