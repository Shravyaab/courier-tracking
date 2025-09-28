from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_shipment, name='create_shipment'),
    path('list/', views.list_shipments, name='list_shipments'),
    path('<int:shipment_id>/', views.shipment_detail, name='shipment_detail'),
    path('<int:shipment_id>/update-status/', views.update_shipment_status, name='update_shipment_status'),
    path('<int:shipment_id>/assign-courier/', views.assign_courier, name='assign_courier'),
]