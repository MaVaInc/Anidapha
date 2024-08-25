from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Item
from .models import Plot
from django.utils.html import format_html

# Настройка админ-панели
admin.site.site_header = "Anidapha Admin Panel"
admin.site.site_title = "Adminka"
admin.site.index_title = "Добро пожаловать хозяин"


# Inline для отображения грядок пользователя
class PlotInline(admin.TabularInline):
    model = Plot
    extra = 0  # Не добавлять пустые строки для новых записей


# Inline для отображения предметов пользователя
class ItemInline(admin.TabularInline):
    model = Item
    extra = 0


# Кастомная админка для модели User
class CustomUserAdmin(UserAdmin):
    # Поля, которые будут отображаться в списке пользователей
    list_display = ('username', 'dogs_balance', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'last_login')

    # Поля, по которым можно фильтровать в списке пользователей
    list_filter = ('is_active', 'dogs_balance')

    # Поля, которые будут отображаться в форме редактирования пользователя
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'telegram_id', 'photo_url')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Balances', {'fields': ('ton_balance', 'dogs_balance', 'platinum_balance', 'gold_balance')}),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
    )

    # Поля, которые будут отображаться в форме создания пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'telegram_id'),
        }),
    )

    # Поля, которые будут использоваться для поиска
    search_fields = ('username', 'telegram_id', 'first_name', 'last_name')
    ordering = ('username',)

    # Inline модели для отображения связанных объектов
    inlines = [PlotInline, ItemInline]


# Регистрация модели User с кастомной администрацией
admin.site.register(User, CustomUserAdmin)


class PlotAdmin(admin.ModelAdmin):
    list_display = ('plot_id', 'user', 'plant_name', 'planted_at', 'is_empty')
    search_fields = ('user__username', 'plant_name')
    list_filter = ('planted_at', 'seed')

admin.site.register(Plot, PlotAdmin)



