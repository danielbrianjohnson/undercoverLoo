from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg


class Loo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    cleanliness = models.IntegerField(default=0, blank=True, null=True)
    privacy = models.IntegerField(default=0, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or f"Loo at {self.latitude}, {self.longitude}"

    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else None

    @property
    def review_count(self):
        """Get total number of reviews"""
        return self.reviews.count()

    class Meta:
        ordering = ['-created_at']


class LooImage(models.Model):
    loo = models.ForeignKey('Loo', on_delete=models.CASCADE, related_name='images')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='loo_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.loo}"

    class Meta:
        ordering = ['-uploaded_at']


class LooReview(models.Model):
    loo = models.ForeignKey('Loo', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.loo}"

    class Meta:
        ordering = ['-created_at']
        # Ensure a user can only review a loo once
        unique_together = ('loo', 'user')
