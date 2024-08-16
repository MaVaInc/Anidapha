from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import set_username


def test_view(request):

    # username = request.data.get('username')

    # if User.objects.filter(username=username).exists():
    #     return JsonResponse({'success': False, 'message': 'Username already taken'}, status=400)
    #
    # user.username = username
    # user.save()

    return request



urlpatterns = [
    path('admin/', admin.site.urls),
path('test/', test_view, name='test'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/set_username/', set_username, name='set_username'),
    path('api/', include('api.urls')),
    path('farm/', include('farm.urls')),
    path('__debug__/', include('debug_toolbar.urls')),
]
