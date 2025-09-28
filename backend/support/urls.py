from django.urls import path
from . import views

urlpatterns = [
    path('tickets/create/', views.create_ticket, name='create_ticket'),
    path('tickets/', views.list_tickets, name='list_tickets'),
    path('feedback/', views.submit_feedback, name='submit_feedback'),
]