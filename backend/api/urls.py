from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LooViewSet, upload_loo_image

router = DefaultRouter()
router.register(r'loos', LooViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload-image/', upload_loo_image, name='upload_loo_image'),
]
