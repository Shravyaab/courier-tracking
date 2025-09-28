from rest_framework import serializers
from .models import Shipment, ShipmentTracking

class ShipmentTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentTracking
        fields = ['status', 'location', 'description', 'latitude', 'longitude', 'timestamp']

class ShipmentSerializer(serializers.ModelSerializer):
    tracking_history = ShipmentTrackingSerializer(many=True, read_only=True)
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = Shipment
        fields = [
            'id', 'tracking_id', 'sender', 'sender_name', 'receiver_name', 'receiver_phone', 
            'receiver_address', 'package_description', 'weight', 'dimensions',
            'pickup_address', 'delivery_address', 'cost', 'payment_method', 
            'payment_status', 'status', 'assigned_courier', 'created_at', 
            'updated_at', 'tracking_history'
        ]
        read_only_fields = ['id', 'tracking_id', 'sender', 'created_at', 'updated_at']

class CreateShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = [
            'receiver_name', 'receiver_phone', 'receiver_address', 
            'package_description', 'weight', 'dimensions', 'pickup_address', 
            'delivery_address', 'payment_method'
        ]
    
    def create(self, validated_data):
        # Calculate cost based on weight (simple calculation)
        weight = validated_data['weight']
        cost = float(weight) * 10  # $10 per kg
        validated_data['cost'] = cost
        
        return super().create(validated_data)