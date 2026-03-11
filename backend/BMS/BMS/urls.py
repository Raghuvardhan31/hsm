
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', include('HAC.urls')),
    path('tenent/', include('HAC.urls')),
    path('owner/', include('HAC.urls')),
]
