from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LooViewSet, LooImageViewSet, LooReviewViewSet, upload_loo_image, my_loos

router = DefaultRouter()
router.register(r'loos', LooViewSet)
router.register(r'images', LooImageViewSet)
router.register(r'reviews', LooReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload-image/', upload_loo_image, name='upload_loo_image'),
    path('my-loos/', my_loos, name='my_loos'),
]
