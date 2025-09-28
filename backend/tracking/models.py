from django.db import models
from shipments.models import Shipment

class TrackingEvent(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50)
    message = models.TextField()
    location = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.shipment.tracking_id} - {self.event_type}"