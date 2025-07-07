from rest_framework import serializers
from .models import Loo, LooImage, LooReview


class LooImageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = LooImage
        fields = ['id', 'image', 'uploaded_at', 'user']


class LooReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = LooReview
        fields = ['id', 'rating', 'text', 'created_at', 'user']


class LooSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    images = LooImageSerializer(many=True, read_only=True)
    reviews = LooReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Loo
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 
                 'cleanliness', 'privacy', 'tags', 'created_at', 'user',
                 'images', 'reviews', 'average_rating', 'review_count']
