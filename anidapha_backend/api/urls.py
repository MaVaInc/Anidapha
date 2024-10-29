from django.urls import path, include
from api.views import *
from django.views.generic import RedirectView
urlpatterns = [
    path('auth/', auth_view, name='auth_view'),
    path('set_username/', set_username, name='set_username'),
    path('user_data/', get_user_data, name='get_user_balances'),
    path('inventory/', get_inventory, name='get_user_inventory'),
    path('reward/', reward, name='reward'),
    path('sell/', sell, name='sell'),
    path('farm/', farm_state_view, name='farm_state_view'),
    path('get_daily_reward/', get_daily_reward, name='get_daily_reward'),
    path('tonconnect-manifest.json', RedirectView.as_view(url='/static/tonconnect-manifest.json', permanent=True)),
]
