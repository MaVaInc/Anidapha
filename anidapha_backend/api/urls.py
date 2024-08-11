from django.urls import path
from .views import auth_view, set_username, get_farm_state

urlpatterns = [
    path('auth/', auth_view, name='auth_view'),
    path('set_username/', set_username, name='set_username'),
    path('get-farm-state', get_farm_state, name='get_farm_state'),
]
