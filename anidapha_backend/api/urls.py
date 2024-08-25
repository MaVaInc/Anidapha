from django.urls import path, include
from .views import *

urlpatterns = [
    path('auth/', auth_view, name='auth_view'),
    path('set_username/', set_username, name='set_username'),
    path('user_data/', get_user_data, name='get_user_balances'),
    path('inventory/', get_inventory, name='get_user_inventory'),
    path('reward/', reward, name='reward'),
    path('sell', sell, name='sell'),
    path('farm/', include('farm.urls')),
    path('get_daily_reward/', get_daily_reward, name='get_daily_reward'),
]
