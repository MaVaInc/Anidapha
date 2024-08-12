from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import set_username

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
path('__debug__/', include('debug_toolbar.urls')),
]

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns += [
    path('api/set_username/', set_username, name='set_username'),
]
