from django.urls import path
from .views import *

urlpatterns = [
    path('state/', farm_state_view, name='farm_state_view'),
    path('seeds/', seeds_view, name='seeds_view'),
    path('plant/', plant_seed_view, name='plant_seed_view'),
]
