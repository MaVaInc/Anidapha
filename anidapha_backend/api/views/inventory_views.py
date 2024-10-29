from api.models import Item, Seed, Resource
from api.serializers import ItemSerializer, SeedSerializer, ResourceSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inventory(request):
    user = request.user
    items = Item.objects.filter(owner=user)
    seeds = Seed.objects.filter(owner=user)
    resources = Resource.objects.filter(owner=user)
    serializer_items = ItemSerializer(items, many=True)
    serializer_seeds = SeedSerializer(seeds, many=True)
    serializer_resources = ResourceSerializer(resources, many=True)
    return JsonResponse(
        {'item': serializer_items.data, 'seed': serializer_seeds.data, 'resources': serializer_resources.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell(request):
    user = request.user
    items = request.data.get('items', [])
    total_earned = 0

    if not items:
        item_id = request.data.get('itemId')
        items = [{'itemId': item_id}] if item_id else []

    for i in items:
        item_id = i.get('itemId')

        if not item_id:
            return JsonResponse({'success': False, 'message': f'Item ID is missing {items}'}, status=400)

        try:
            item = Item.objects.get(id=item_id, owner=user)
        except Item.DoesNotExist:
            try:
                item = Seed.objects.get(id=item_id, owner=user)
            except Seed.DoesNotExist:
                try:
                    item = Resource.objects.get(id=item_id, owner=user)
                except Seed.DoesNotExist:
                    return JsonResponse(
                        {'success': False, 'message': f'Item with ID {item_id} not found or does not belong to user'},
                        status=400)

        # Добавляем цену предмета к балансу пользователя
        user.dogs_balance = float(user.dogs_balance) + float(item.price)
        total_earned += float(item.price)

        # Удаляем предмет из базы данных
        item.delete()

    # Сохраняем изменения в пользователе
    user.save()

    return JsonResponse({'success': True, 'message': f'You earned {total_earned} DOGS'})
