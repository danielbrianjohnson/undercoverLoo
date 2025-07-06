from django.contrib import admin
from .models import Loo, LooImage

class LooImageInline(admin.TabularInline):
    model = LooImage
    extra = 1  # show 1 blank image input by default
    readonly_fields = ['uploaded_at']
    fields = ['image', 'uploaded_at']

class LooAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'created_at')
    search_fields = ('name', 'description', 'tags')
    list_filter = ('cleanliness', 'privacy')
    inlines = [LooImageInline]

admin.site.register(Loo, LooAdmin)
admin.site.register(LooImage)
