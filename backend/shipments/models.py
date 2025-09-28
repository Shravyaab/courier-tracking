from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Shipment(models.Model):
    STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('picked_up', 'Picked Up'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_CHOICES = [
        ('cod', 'Cash on Delivery'),
        ('online', 'Online Payment'),
    ]
    
    tracking_id = models.CharField(max_length=20, unique=True, default=uuid.uuid4)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_shipments')
    receiver_name = models.CharField(max_length=100)
    receiver_phone = models.CharField(max_length=15)
    receiver_address = models.TextField()
    
    package_description = models.TextField()
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    dimensions = models.CharField(max_length=100, blank=True)
    
    pickup_address = models.TextField()
    delivery_address = models.TextField()
    
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    payment_status = models.BooleanField(default=False)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    assigned_courier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_shipments')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.tracking_id:
            self.tracking_id = f"TRK{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.tracking_id} - {self.receiver_name}"

class ShipmentTracking(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='tracking_history')
    status = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.shipment.tracking_id} - {self.status}"