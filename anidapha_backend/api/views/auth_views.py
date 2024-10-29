from django.utils import timezone
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User
import urllib.parse, json, secrets, hmac, hashlib, time
from rest_framework.permissions import IsAuthenticated, AllowAny
@api_view(['POST'])
@permission_classes([AllowAny])
def auth_view(request):
    init_data = request.data.get('initData')
    bot_token = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'
    if validate_init_data(init_data, bot_token):
        user_info_dict = urllib.parse.parse_qs(init_data)
        user_info = json.loads(user_info_dict['user'][0])
        auth_date = json.loads(user_info_dict['auth_date'][0])
        user_info['auth_date'] = timezone.datetime.fromtimestamp(int(auth_date)).strftime('%Y-%m-%d %H:%M:%S')

        telegram_id = user_info['id']
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': f"user_{secrets.token_hex(3)}",
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name'],
                'photo_url': None,
                'auth_date': auth_date,
            }
        )

        if created or not user.username:
            return JsonResponse({
                'welcome_message': "Welcome! Please choose a nickname.",
                'suggested_username': 'x_' + user.username,
                'registered': False
            })
        else:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'welcome_message': f"Welcome back, {user.username}!",
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'registered': True,
                'ton_balance': user.ton_balance,
                'platinum_balance': user.platinum_balance,
                'gold_balance': user.gold_balance
            })
    else:
        return JsonResponse({'success': False, 'message': f'Invalid init data {init_data}'}, status=401)


def validate_init_data(init_data: str, bot_token: str) -> bool:
    try:
        init_data_dict = dict(urllib.parse.parse_qsl(init_data))
        hash_received = init_data_dict.pop('hash', None)
        data_check_string = "\n".join([f"{k}={v}" for k, v in sorted(init_data_dict.items())])
        secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
        hash_calculated = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(hash_received, hash_calculated) and time.time() - int(init_data_dict.get('auth_date', 0)) <= 86400
    except Exception as e:
        print(f"Validation error: {e}")
        return False


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_username(request):
    user = request.user
    username = request.data.get('username')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'Username already taken'}, status=400)

    user.username = username
    user.save()
    return JsonResponse({'success': True, 'message': f'Username set to {username}'})
