from rest_framework import serializers
from .models import Loo, LooImage


class LooImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LooImage
        fields = ['id', 'image', 'uploaded_at']


class LooSerializer(serializers.ModelSerializer):
    images = LooImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Loo
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 
                 'cleanliness', 'privacy', 'tags', 'created_at', 'images']
