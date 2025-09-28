from django.urls import path
from . import views

urlpatterns = [
    path('<int:shipment_id>/process/', views.process_payment, name='process_payment'),
    path('<int:shipment_id>/status/', views.payment_status, name='payment_status'),
]