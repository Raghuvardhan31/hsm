from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import json
from .models import *
from .serializers import *
from .models import HostelFloorRoom, ApartmentFloorUnit, CommercialFloor,Tenent
from .serializers import (
    OwnerRegistrationSerializer,
    HostelSerializer,
    ApartmentSerializer,
    CommercialSerializer,
    BankSerializer,
    TenentSerializer,
    TenantLoginSerializer,
    OwnerLoginSerializer
)


@api_view(['POST'])
@transaction.atomic
def register_owner(request):

    print("Request Data:", request.data)
    print("Request Files:", request.FILES)

    stay_type = request.data.get("stayType")

    # ============================
    # 1️⃣ OWNER
    # ============================
    owner_serializer = OwnerRegistrationSerializer(data=request.data)

    if not owner_serializer.is_valid():
        return Response(owner_serializer.errors, status=400)

    owner = owner_serializer.save()

    # ============================
    # 2️⃣ PROPERTY
    # ============================
    property_obj = None
    FACILITY_FIELDS = [
    "wifi",
    "parking",
    "lift",
    "power_backup",
    "security",
    "play_area",
    "mess",
    "laundry",
    "water",
    "ac",
    "non_ac",
]

    facilities = [
    field for field in FACILITY_FIELDS
    if str(request.data.get(field)).lower() == "true"
]
    # property_data = request.data.copy()
    property_data = request.data.dict()
    property_data.pop('facilities', None)
    property_data['owner'] = owner.id
    property_data['facilities'] = facilities
    

    if stay_type == "hostel":
        serializer = HostelSerializer(data=property_data)

    elif stay_type == "apartment":
        serializer = ApartmentSerializer(data=property_data)

    elif stay_type == "commercial":
        serializer = CommercialSerializer(data=property_data)

    else:
        return Response({"error": "Invalid stayType"}, status=400)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    property_obj = serializer.save()

    # ============================
    # 3️⃣ BANK
    # ============================
    bank_data = request.data.copy()
    bank_data['owner'] = owner.id

    bank_serializer = BankSerializer(data=bank_data)

    if not bank_serializer.is_valid():
        return Response(bank_serializer.errors, status=400)

    bank_serializer.save()

    # ============================
    # 4️⃣ FLOORS
    # ============================
    building_layout = request.data.get("building_layout")

    if building_layout:

        layout = json.loads(building_layout)   # ⭐ IMPORTANT
        # floors = layout.get("floors", [])
        floors = layout

        for floor_data in floors:

            floor_no = floor_data.get("floorNo")

            # ---------------------
            # HOSTEL
            # ---------------------
            if stay_type == "hostel":

                for room in floor_data.get("rooms", []):
                    HostelFloorRoom.objects.create(
                        owner=owner,
                        hostel=property_obj,
                        floor=floor_no,
                        roomNo=room.get("roomNo"),
                        # sharing=room.get("sharing")
                        sharing=room.get("beds")
                    )

            # ---------------------
            # APARTMENT
            # ---------------------
            elif stay_type == "apartment":

                for flat in floor_data.get("flats", []):
                    ApartmentFloorUnit.objects.create(
                        owner=owner,
                        apartment=property_obj,
                        floor=floor_no,
                        flatNo=flat.get("flatNo"),
                        bhk=flat.get("bhk")
                    )

            # ---------------------
            # COMMERCIAL (FIXED ⭐)
            # ---------------------
            elif stay_type == "commercial":

                CommercialFloor.objects.create(
                    owner=owner,
                    commercial_property=property_obj,
                    floorNo=floor_no,
                    area_sqft=floor_data.get("area")  # ✅ FIXED
                )

    return Response(
        {"message": "Owner Registered Successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def register_tenent(request):
    print("Request Data:", request.data)
    print("Request Files:", request.FILES)

    serializer = TenentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Tenent registered successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED)
    return Response(
        {
            "message": "Validation Error",
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def tenant_login(request):

    serializer = TenantLoginSerializer(data=request.data)

    if serializer.is_valid():

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            tenant = Tenent.objects.get(email=email)

            if tenant.password == password:
                return Response({
                    "message": "Login Successful",
                    "tenant_id": tenant.id,
                    "name": tenant.name,
                    "email": tenant.email
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    "error": "Invalid Password"
                }, status=status.HTTP_400_BAD_REQUEST)

        except Tenent.DoesNotExist:
            return Response({
                "error": "Email not registered"
            }, status=status.HTTP_404_NOT_FOUND)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def owner_login(request):
    serializer = OwnerLoginSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            owner = Owners.objects.get(email=email)

            if owner.password == password:
                return Response({
                    "message": "Login Successful",
                    "owner_id": owner.id,
                    "email": owner.email,
                    "name": owner.name
                })

            else:
                return Response({"error": "Invalid Password"}, status=400)

        except Owners.DoesNotExist:
            return Response({"error": "Owner not found"}, status=404)

    return Response(serializer.errors, status=400)

# @api_view(['GET'])
# def get_hostel_step3(request, email):

#     try:
#         owner = Owners.objects.get(email=email)
#     except Owners.DoesNotExist:
#         return Response({"error": "Owner not found"}, status=404)

#     try:
#         hostel = StayHostelDetails.objects.get(owner=owner)
#     except StayHostelDetails.DoesNotExist:
#         return Response({"error": "Hostel not found"}, status=404)

#     floors = HostelFloorRoom.objects.filter(hostel=hostel)

#     layout = {}

#     for room in floors:
#         floor_no = room.floor

#         if floor_no not in layout:
#             layout[floor_no] = []

#         layout[floor_no].append({
#             "roomNo": room.roomNo,
#             "beds": room.sharing
#         })

#     result = []

#     for floor_no, rooms in layout.items():
#         result.append({
#             "floorNo": floor_no,
#             "rooms": rooms
#         })
#         response_data = {
#         "owner": {
#             "id": owner.id,
#             "name": owner.name,
#             "email": owner.email,
#             "phone": owner.phone
#         },
#         "hostel": {
#             "id": hostel.id,
#             "hostelName": hostel.hostelName,
#             "location": hostel.location
#         },
#         "property_type": "hostel",
#         "building_layout": result
#     }

#     # Print full response in terminal
#     print("API Response Data:", response_data)

#     return Response(response_data)
#     # return Response({
#     #     "owner": {
#     #         "id": owner.id,
#     #         "name": owner.name,
#     #         "email": owner.email,
#     #         "phone": owner.phone
#     #     },
#     #     "hostel": {
#     #         "id": hostel.id,
#     #         "hostelName": hostel.hostelName,
#     #         "location": hostel.location
#     #     },
#     #     "property_type": "hostel",
#     #     "building_layout": result
#     # })

@api_view(['GET'])
def get_hostel_step3(request, email):

    try:
        owner = Owners.objects.get(email=email)
    except Owners.DoesNotExist:
        return Response({"error": "Owner not found"}, status=404)

    # Get objects safely
    hostel = StayHostelDetails.objects.filter(owner=owner).first()
    apartment = ApartmentStayDetails.objects.filter(owner=owner).first()
    commercial = CommericialDetails.objects.filter(owner=owner).first()

    response_data = {}

    # ================= HOSTEL =================
    if hostel is not None:

        floors = HostelFloorRoom.objects.filter(hostel=hostel)

        layout = {}

        for room in floors:
            floor_no = room.floor

            if floor_no not in layout:
                layout[floor_no] = []

            layout[floor_no].append({
                "roomNo": room.roomNo,
                "beds": room.sharing
            })

        result = []

        for floor_no, rooms in layout.items():
            result.append({
                "floorNo": floor_no,
                "rooms": rooms
            })

        response_data = {
            "property_type": "hostel",
            "building_layout": result
        }

    # ================= APARTMENT =================
    elif apartment is not None:

        floors = ApartmentFloorUnit.objects.filter(apartment=apartment)

        layout = {}

        for flat in floors:
            floor_no = flat.floor

            if floor_no not in layout:
                layout[floor_no] = []

            layout[floor_no].append({
                "flatNo": flat.flatNo,
                "bhk": flat.bhk
            })

        result = []

        for floor_no, flats in layout.items():
            result.append({
                "floorNo": floor_no,
                "flats": flats
            })

        response_data = {
            "property_type": "apartment",
            "building_layout": result
        }

    # ================= COMMERCIAL =================
    elif commercial is not None:

        floors = CommercialFloor.objects.filter(commercial_property=commercial)

        layout = []

        for floor in floors:
            layout.append({
                "floorNo": floor.floorNo,
                "area_sqft": floor.area_sqft
            })

        response_data = {
            "property_type": "commercial",
            "building_layout": layout
        }

    else:
        return Response({"error": "No property found for this owner"}, status=404)

    # ================= OWNER INFO =================
    # response_data["owner"] = {
        
    #     "id": owner.id,
    #     "name": owner.name,
    #     "email": owner.email,
    #     "phone": owner.phone
    # }
    response_data["owner"] = {
    "id": owner.id,
    "name": owner.name,
    "email": owner.email,
    "phone": owner.phone
}

    print("API Response:", response_data)

    return Response(response_data)



 
@api_view(['GET'])
def get_properties_listing(request):
    property_list = []
 
    # ---------------- HOSTELS ----------------
    hostels = StayHostelDetails.objects.select_related('owner').all()
    for hostel in hostels:
        property_list.append({
            "id": str(hostel.id),
            "type": "Hostel",
            "hostelType": hostel.hostelType.capitalize() if hostel.hostelType else None,
            "name": hostel.hostelName,
            "address": hostel.location,
            "contact": hostel.owner.phone if hostel.owner else None,
            "latitude": None,   # not available in model
            "longitude": None,  # not available in model
            "image": request.build_absolute_uri(hostel.owner_property_photos.url) if hostel.owner_property_photos else None,
            "isAvailable": True,   # default for now
            "rating": None,        # not available in model
            "facilities": hostel.facilities if hostel.facilities else [],
        })
 
    # ---------------- APARTMENTS ----------------
    apartments = ApartmentStayDetails.objects.select_related('owner').all()
    for apartment in apartments:
        allowed_tenants = None
        if apartment.tenantType == "family":
            allowed_tenants = "FamilyOnly"
        elif apartment.tenantType == "bachelors":
            allowed_tenants = "BachelorsOnly"
 
        property_list.append({
            "id": str(apartment.id),
            "type": "Apartment",
            "name": apartment.apartmentName,
            "address": apartment.location,
            "contact": apartment.owner.phone if apartment.owner else None,
            "latitude": None,   # not available in model
            "longitude": None,  # not available in model
            "image": request.build_absolute_uri(apartment.owner_property_photos.url) if apartment.owner_property_photos else None,
            "isAvailable": True,   # default for now
            "rating": None,        # not available in model
            "facilities": apartment.facilities if apartment.facilities else [],
            "allowedTenants": allowed_tenants,
        })
 
    # ---------------- COMMERCIAL ----------------
    commercials = CommericialDetails.objects.select_related('owner').all()
    for commercial in commercials:
        property_list.append({
            "id": str(commercial.id),
            "type": "Commercial",
            "name": commercial.commercialName,
            "address": commercial.location,
            "contact": commercial.owner.phone if commercial.owner else None,
            "latitude": None,   # not available in model
            "longitude": None,  # not available in model
            "image": request.build_absolute_uri(commercial.owner_property_photos.url) if commercial.owner_property_photos else None,
            "isAvailable": True,   # default for now
            "rating": None,        # not available in model
            "facilities": commercial.facilities if commercial.facilities else [],
        })
 
    return Response(
        {
            "count": len(property_list),
            "data": property_list
        },
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def registerbeds(request):
    serializer = TenantSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Tenant Added Successfully",
            "data": serializer.data
            }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tenantsbeds(request):
    tenants = TenantBeds.objects.all()
    serializer = TenantSerializer(tenants, many=True)

    # Print data in Django console
    print("Tenant Data:", serializer.data)

    return Response({
        "message": "Tenant list fetched successfully",
        "data": serializer.data
    })