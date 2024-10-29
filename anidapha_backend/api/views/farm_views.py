from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from api.models import Plot, Seed
from api.serializers import PlotSerializer, SeedSerializer
from datetime import timedelta
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farm_state_view(request):
    user = request.user
    plots = Plot.objects.filter(user=user)
    serializer = PlotSerializer(plots, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seeds_view(request):
    user = request.user
    seeds = Seed.objects.filter(owner=user)
    serializer = SeedSerializer(seeds, many=True)

    data = {
        "commonSeeds": [seed for seed in serializer.data if seed['rarity'] == 'common'],
        "rareSeeds": [seed for seed in serializer.data if seed['rarity'] == 'rare'],
        "epicSeeds": [seed for seed in serializer.data if seed['rarity'] == 'epic'],
        "legendarySeeds": [seed for seed in serializer.data if seed['rarity'] == 'legendary']
    }
    return JsonResponse(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def plant_seed_view(request):
    user = request.user
    plot_id = request.data.get('plot_id')
    seed_id = request.data.get('seed_id')

    plot = get_object_or_404(Plot, id=plot_id, user=user)
    seed = get_object_or_404(Seed, id=seed_id, owner=user)

    try:
        plot.plant_seed(seed)
        seed.delete()
        serializer = PlotSerializer(plot)
        return JsonResponse({"success": True, "plot": serializer.data})
    except ValueError as e:
        return JsonResponse({"success": False, "message": str(e)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_reward(request):
    user = request.user
    now = timezone.now()

    if user.last_daily_reward:
        time_since_last_reward = now - user.last_daily_reward
        if time_since_last_reward < timedelta(days=1):
            return JsonResponse({
                'message': 'You have already claimed your daily reward. Please try again later.',
                'next_available_in': str(timedelta(days=1) - time_since_last_reward)
            }, status=403)

    reward = Seed.objects.create(owner=user, name="Бурьян", growth_time=timedelta(hours=1), rarity="common")
    user.last_daily_reward = now
    user.save()

    return JsonResponse({
        'message': 'Daily reward claimed!',
        'reward': {
            'name': reward.name,
            'rarity': reward.rarity,
            'growth_time': str(reward.growth_time),
            'price': reward.price
        }
    })
