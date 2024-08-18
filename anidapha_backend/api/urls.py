from django.urls import path
from .views import auth_view, set_username, get_user_data

urlpatterns = [
    path('auth/', auth_view, name='auth_view'),
    path('set_username/', set_username, name='set_username'),
    path('user_data/', get_user_data, name='get_user_balances'),
]
