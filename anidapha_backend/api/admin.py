from django.contrib import admin
from .models import User

# admin.site.register(User)
from django.contrib import admin

admin.site.site_header = "Anidapha Admin Panel"
admin.site.site_title = "Adminka"
admin.site.index_title = "Добро пожаловать хозяин"
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Импортируйте вашу пользовательскую модель

class CustomUserAdmin(UserAdmin):
    # Поля, которые будут отображаться в списке пользователей
    list_display = ('username', 'telegram_id', 'first_name', 'last_name')
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

# Зарегистрируйте модель пользователя с кастомной администрацией
admin.site.register(User, CustomUserAdmin)
