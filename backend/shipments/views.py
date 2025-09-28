from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Shipment, ShipmentTracking
from .serializers import ShipmentSerializer, CreateShipmentSerializer, ShipmentTrackingSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_shipment(request):
    serializer = CreateShipmentSerializer(data=request.data)
    if serializer.is_valid():
        shipment = serializer.save(sender=request.user)
        
        # Create initial tracking entry
        ShipmentTracking.objects.create(
            shipment=shipment,
            status='Booked',
            location='Origin',
            description='Shipment has been booked'
        )
        
        return Response(ShipmentSerializer(shipment).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_shipments(request):
    if request.user.role == 'customer':
        shipments = Shipment.objects.filter(sender=request.user)
    elif request.user.role == 'courier':
        shipments = Shipment.objects.filter(assigned_courier=request.user)
    else:  # admin
        shipments = Shipment.objects.all()
    
    serializer = ShipmentSerializer(shipments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shipment_detail(request, shipment_id):
    shipment = get_object_or_404(Shipment, id=shipment_id)
    
    # Check permissions
    if request.user.role == 'customer' and shipment.sender != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    elif request.user.role == 'courier' and shipment.assigned_courier != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ShipmentSerializer(shipment)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_shipment_status(request, shipment_id):
    shipment = get_object_or_404(Shipment, id=shipment_id)
    
    # Only courier or admin can update status
    if request.user.role not in ['courier', 'admin']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    new_status = request.data.get('status')
    location = request.data.get('location', '')
    description = request.data.get('description', '')
    
    if new_status:
        shipment.status = new_status
        shipment.save()
        
        # Create tracking entry
        ShipmentTracking.objects.create(
            shipment=shipment,
            status=new_status,
            location=location,
            description=description
        )
        
        return Response({'message': 'Status updated successfully'})
    
    return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_courier(request, shipment_id):
    if request.user.role != 'admin':
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    shipment = get_object_or_404(Shipment, id=shipment_id)
    courier_id = request.data.get('courier_id')
    
    if courier_id:
        from accounts.models import User
        courier = get_object_or_404(User, id=courier_id, role='courier')
        shipment.assigned_courier = courier
        shipment.save()
        
        return Response({'message': 'Courier assigned successfully'})
    
    return Response({'error': 'Courier ID is required'}, status=status.HTTP_400_BAD_REQUEST)