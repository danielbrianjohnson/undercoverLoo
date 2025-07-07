from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Loo, LooImage, LooReview
from .serializers import LooSerializer, LooImageSerializer, LooReviewSerializer


class LooViewSet(viewsets.ModelViewSet):
    queryset = Loo.objects.all().order_by('-created_at')
    serializer_class = LooSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get', 'post'], url_path='reviews')
    def reviews(self, request, pk=None):
        """
        GET: List all reviews for a specific loo
        POST: Create a new review for a specific loo
        """
        loo = self.get_object()
        
        if request.method == 'GET':
            reviews = loo.reviews.all()
            serializer = LooReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check if user already reviewed this loo
            existing_review = LooReview.objects.filter(loo=loo, user=request.user).first()
            if existing_review:
                return Response(
                    {'error': 'You have already reviewed this loo'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = LooReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, loo=loo)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LooImageViewSet(viewsets.ModelViewSet):
    queryset = LooImage.objects.all()
    serializer_class = LooImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LooReviewViewSet(viewsets.ModelViewSet):
    queryset = LooReview.objects.all()
    serializer_class = LooReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """Allow users to only edit/delete their own reviews"""
        if self.action in ['update', 'partial_update', 'destroy']:
            return self.queryset.filter(user=self.request.user)
        return self.queryset


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_loos(request):
    """
    Return a list of Loos created by the currently logged-in user
    """
    user_loos = Loo.objects.filter(user=request.user).order_by('-created_at')
    serializer = LooSerializer(user_loos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_loo_image(request):
    """
    Upload an image for a specific loo
    Expects: loo_id and image file
    """
    try:
        loo_id = request.data.get('loo_id')
        image = request.FILES.get('image')
        
        if not loo_id or not image:
            return Response(
                {'error': 'Both loo_id and image are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (5MB limit)
        if image.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'Image size must be less than 5MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        if image.content_type not in allowed_types:
            return Response(
                {'error': 'Only JPEG and PNG images are allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            loo = Loo.objects.get(id=loo_id)
        except Loo.DoesNotExist:
            return Response(
                {'error': 'Loo not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create the image record
        loo_image = LooImage.objects.create(loo=loo, image=image, user=request.user)
        serializer = LooImageSerializer(loo_image)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
