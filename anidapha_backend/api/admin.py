from django.contrib import admin
from .models import User, Item, Plot, Seed
from django.contrib.auth.admin import UserAdmin

class PlotInline(admin.TabularInline):
    model = Plot
    extra = 0

class ItemInline(admin.TabularInline):
    model = Item
    extra = 0

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'dogs_balance', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'last_login')
    list_filter = ('is_active', 'dogs_balance')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'telegram_id', 'photo_url')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Balances', {'fields': ('ton_balance', 'dogs_balance', 'platinum_balance', 'gold_balance')}),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'telegram_id'),
        }),
    )
    search_fields = ('username', 'telegram_id', 'first_name', 'last_name')
    ordering = ('username',)
    inlines = [PlotInline, ItemInline]

class PlotAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'plant_name', 'planted_at', 'is_empty')
    search_fields = ('user__username', 'plant_name')
    list_filter = ('planted_at', 'seed')

class SeedAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'growth_time')
    search_fields = ('name', 'owner__username')
    list_filter = ('growth_time',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Plot, PlotAdmin)
admin.site.register(Item)
admin.site.register(Seed, SeedAdmin)
