from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from shipments.models import Shipment
from shipments.serializers import ShipmentSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def track_shipment(request, tracking_id):
    try:
        shipment = Shipment.objects.get(tracking_id=tracking_id)
        serializer = ShipmentSerializer(shipment)
        return Response(serializer.data)
    except Shipment.DoesNotExist:
        return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)