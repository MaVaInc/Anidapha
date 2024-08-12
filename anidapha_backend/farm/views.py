from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Plot, Seed
from .serializers import PlotSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_farm_state(request):
    user = request.user
    plots = Plot.objects.filter(user=user)
    serializer = PlotSerializer(plots, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def plant_seed(request):
    user = request.user
    plot_id = request.data.get('plot_id')
    seed_id = request.data.get('seed_id')

    try:
        plot = Plot.objects.get(user=user, plot_id=plot_id)
        seed = Seed.objects.get(id=seed_id, owner=user)

        if not plot.is_empty():
            return Response({'success': False, 'message': 'This plot is already occupied.'}, status=400)

        plot.plant_name = seed.name
        plot.texture_url = f"/images/seeds/{seed_id}.webp"
        plot.planted_at = timezone.now()
        plot.save()

        # Удаляем семя из инвентаря
        seed.delete()

        return Response({'success': True, 'plot': PlotSerializer(plot).data})
    except Plot.DoesNotExist:
        return Response({'success': False, 'message': 'Plot does not exist'}, status=404)
    except Seed.DoesNotExist:
        return Response({'success': False, 'message': 'Seed does not exist in inventory'}, status=404)
