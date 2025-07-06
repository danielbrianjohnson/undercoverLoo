from django.db import models


from django.db import models

class Loo(models.Model):
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

    class Meta:
        ordering = ['-created_at']


class LooImage(models.Model):
    loo = models.ForeignKey('Loo', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='loo_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.loo}"

    class Meta:
        ordering = ['-uploaded_at']
