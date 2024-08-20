from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Plot, Seed
from .serializers import PlotSerializer, SeedSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def farm_state_view(request):
    user = request.user
    plots = Plot.objects.filter(user=user)
    plot_serializer = PlotSerializer(plots, many=True)

    return JsonResponse(plot_serializer.data, safe=False)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seeds_view(request):
    user = request.user
    seeds = Seed.objects.filter(owner=user)
    seed_serializer = SeedSerializer(seeds, many=True)

    seed_data = {
        "commonSeeds": [seed for seed in seed_serializer.data if seed['rarity'] == 'common'],
        "rareSeeds": [seed for seed in seed_serializer.data if seed['rarity'] == 'rare'],
        "epicSeeds": [seed for seed in seed_serializer.data if seed['rarity'] == 'epic'],
        "legendarySeeds": [seed for seed in seed_serializer.data if seed['rarity'] == 'legendary']
    }
    # seed_data = {"key": "value"}
    return JsonResponse(seed_data)


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
        plot_serializer = PlotSerializer(plot)
        return JsonResponse({"success": True, "plot": plot_serializer.data})
    except ValueError as e:
        return JsonResponse({"success": False, "message": str(e)})
