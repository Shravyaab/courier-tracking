from rest_framework import serializers
from .models import Ticket, TicketMessage, Feedback

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'sender', 'sender_name', 'message', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'user_name', 'subject', 'description', 'priority', 'status', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_name', 'shipment', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']