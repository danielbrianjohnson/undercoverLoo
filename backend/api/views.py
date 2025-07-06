from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Loo, LooImage
from .serializers import LooSerializer, LooImageSerializer


class LooViewSet(viewsets.ModelViewSet):
    queryset = Loo.objects.all().order_by('-created_at')
    serializer_class = LooSerializer


@api_view(['POST'])
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
        loo_image = LooImage.objects.create(loo=loo, image=image)
        serializer = LooImageSerializer(loo_image)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
