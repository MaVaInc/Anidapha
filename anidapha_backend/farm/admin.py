from django.contrib import admin
from .models import Seed

class SeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'growth_time')
    search_fields = ('name', 'owner__username')
    list_filter = ('growth_time',)



admin.site.register(Seed, SeedAdmin)

