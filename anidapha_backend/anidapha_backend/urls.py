from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import set_username


def test_view(request):
    return HttpResponse("Test page")



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/set_username/', set_username, name='set_username'),
    path('api/', include('api.urls')),
    path('farm/', include('farm.urls')),
    path('__debug__/', include('debug_toolbar.urls')),
]
