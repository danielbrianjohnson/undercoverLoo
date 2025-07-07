from django.contrib import admin
from .models import Loo, LooImage, LooReview


class LooImageInline(admin.TabularInline):
    model = LooImage
    extra = 1  # show 1 blank image input by default
    readonly_fields = ['uploaded_at', 'user']
    fields = ['image', 'user', 'uploaded_at']


class LooReviewInline(admin.TabularInline):
    model = LooReview
    extra = 0  # don't show blank review inputs by default
    readonly_fields = ['created_at', 'user']
    fields = ['user', 'rating', 'text', 'created_at']


@admin.register(Loo)
class LooAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'latitude', 'longitude', 'average_rating', 'review_count', 'created_at')
    search_fields = ('name', 'description', 'tags', 'user__username')
    list_filter = ('cleanliness', 'privacy', 'created_at', 'user')
    readonly_fields = ['created_at', 'average_rating', 'review_count']
    inlines = [LooImageInline, LooReviewInline]
    
    def average_rating(self, obj):
        return obj.average_rating
    average_rating.short_description = 'Avg Rating'
    
    def review_count(self, obj):
        return obj.review_count
    review_count.short_description = 'Reviews'


@admin.register(LooImage)
class LooImageAdmin(admin.ModelAdmin):
    list_display = ('loo', 'user', 'uploaded_at')
    list_filter = ('uploaded_at', 'user')
    search_fields = ('loo__name', 'user__username')
    readonly_fields = ['uploaded_at']


@admin.register(LooReview)
class LooReviewAdmin(admin.ModelAdmin):
    list_display = ('loo', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at', 'user')
    search_fields = ('loo__name', 'user__username', 'text')
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        """Show reviews with related loo and user data"""
        return super().get_queryset(request).select_related('loo', 'user')
