from django.urls import path
from . import views

urlpatterns = [
    path('farm/state/', views.get_farm_state, name='get_farm_state'),
    path('farm/plant/', views.plant_seed, name='plant_seed'),
]
