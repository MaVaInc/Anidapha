from django.contrib import admin
from .models import Seed, Plot

class SeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'growth_time')
    search_fields = ('name', 'owner__username')
    list_filter = ('growth_time',)

class PlotAdmin(admin.ModelAdmin):
    list_display = ('plot_id', 'user', 'plant_name', 'planted_at', 'is_empty')
    search_fields = ('user__username', 'plant_name')
    list_filter = ('planted_at', 'seed')

admin.site.register(Seed, SeedAdmin)
admin.site.register(Plot, PlotAdmin)
