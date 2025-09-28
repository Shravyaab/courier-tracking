from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from shipments.models import Shipment
from .models import Payment
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request, shipment_id):
    shipment = get_object_or_404(Shipment, id=shipment_id, sender=request.user)
    
    payment_method = request.data.get('payment_method')
    
    if payment_method == 'cod':
        # For COD, just mark as pending
        payment, created = Payment.objects.get_or_create(
            shipment=shipment,
            defaults={
                'amount': shipment.cost,
                'payment_method': payment_method,
                'payment_status': 'pending'
            }
        )
        return Response({'message': 'COD payment registered'})
    
    else:
        # For online payments, simulate payment processing
        payment, created = Payment.objects.get_or_create(
            shipment=shipment,
            defaults={
                'amount': shipment.cost,
                'payment_method': payment_method,
                'payment_status': 'completed',
                'transaction_id': f"TXN{uuid.uuid4().hex[:8].upper()}"
            }
        )
        
        shipment.payment_status = True
        shipment.save()
        
        return Response({'message': 'Payment processed successfully', 'transaction_id': payment.transaction_id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, shipment_id):
    shipment = get_object_or_404(Shipment, id=shipment_id)
    
    try:
        payment = Payment.objects.get(shipment=shipment)
        return Response({
            'payment_status': payment.payment_status,
            'amount': payment.amount,
            'payment_method': payment.payment_method,
            'transaction_id': payment.transaction_id
        })
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)