from django.urls import path
from django.conf import settings
from . import views
from django.conf.urls.static import static

urlpatterns = [
   
    path('owner/',views.register_owner),
    path('tenent/',views.register_tenent),
    path('login/',views.tenant_login),
    path('verify/',views.owner_login),
    path('details/<path:email>/', views.get_hostel_step3),
    path('owner_props/', views.get_properties_listing),
    path('tenentbeds/', views.registerbeds),
    path('getbeds/', views.get_tenantsbeds),
    path('owner-admin/', views.owner_admin_list),
    path('owner_data/<path:email>/', views.get_owner_full_details),
    path('update_status/', views.update_status),
    path('tenantdetails/<str:email>/', views.tenantdetails),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)