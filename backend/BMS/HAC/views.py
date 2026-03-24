from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.core.files.storage import default_storage
from django.conf import settings
import json

from .models import (
    Owners,
    StayHostelDetails,
    ApartmentStayDetails,
    CommericialDetails,
    HostelFloorRoom,
    ApartmentFloorUnit,
    BankDetails,
    CommercialFloor,
    Tenent,
    TenantBeds
)

from .serializers import (
    OwnerRegistrationSerializer,
    HostelSerializer,
    ApartmentSerializer,
    CommercialSerializer,
    BankSerializer,
    TenentSerializer,
    TenantLoginSerializer,
    OwnerLoginSerializer,
    TenantSerializer
)


@api_view(['POST'])
@transaction.atomic
def register_owner(request):
    print("Request Data:", request.data)
    print("Request Files:", request.FILES)

    stay_type = request.data.get("stayType")

    if stay_type not in ["hostel", "apartment", "commercial"]:
        return Response({"error": "Invalid stayType"}, status=status.HTTP_400_BAD_REQUEST)

    # 1️⃣ OWNER
    owner_serializer = OwnerRegistrationSerializer(data=request.data)
    if not owner_serializer.is_valid():
        transaction.set_rollback(True)
        return Response(owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    owner = owner_serializer.save(status='pending')

    # 2️⃣ FACILITIES
    FACILITY_FIELDS = [
        "wifi",
        "parking",
        "food",
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

    # 3️⃣ SAVE MULTIPLE GALLERY IMAGES
    uploaded_gallery_files = request.FILES.getlist("gallery_images")
    gallery_file_paths = []

    for file in uploaded_gallery_files:
        saved_path = default_storage.save(f"property_gallery/{file.name}", file)
        gallery_file_paths.append(saved_path)

    # 4️⃣ PROPERTY DATA
    property_data = request.data.dict()
    property_data.pop("facilities", None)
    property_data.pop("gallery_images", None)

    property_data["owner"] = owner.id
    property_data["facilities"] = facilities
    property_data["gallery_images"] = gallery_file_paths

    if stay_type == "hostel":
        serializer = HostelSerializer(data=property_data)
    elif stay_type == "apartment":
        serializer = ApartmentSerializer(data=property_data)
    else:
        serializer = CommercialSerializer(data=property_data)

    if not serializer.is_valid():
        transaction.set_rollback(True)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    property_obj = serializer.save()

    # 5️⃣ BANK
    bank_data = request.data.copy()
    bank_data["owner"] = owner.id

    bank_serializer = BankSerializer(data=bank_data)
    if not bank_serializer.is_valid():
        transaction.set_rollback(True)
        return Response(bank_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    bank_serializer.save()

    # 6️⃣ FLOORS
    building_layout = request.data.get("building_layout")

    if building_layout:
        try:
            layout = json.loads(building_layout)
        except json.JSONDecodeError:
            transaction.set_rollback(True)
            return Response(
                {"error": "Invalid building_layout JSON"},
                status=status.HTTP_400_BAD_REQUEST
            )

        for floor_data in layout:
            floor_no = floor_data.get("floorNo")

            if stay_type == "hostel":
                for room in floor_data.get("rooms", []):
                    HostelFloorRoom.objects.create(
                        owner=owner,
                        hostel=property_obj,
                        floor=floor_no,
                        roomNo=room.get("roomNo"),
                        sharing=room.get("beds")
                    )

            elif stay_type == "apartment":
                for flat in floor_data.get("flats", []):
                    ApartmentFloorUnit.objects.create(
                        owner=owner,
                        apartment=property_obj,
                        floor=floor_no,
                        flatNo=flat.get("flatNo"),
                        bhk=flat.get("bhk")
                    )

            elif stay_type == "commercial":
                for section in floor_data.get("sections", []):
                    CommercialFloor.objects.create(
                        owner=owner,
                        commercial_property=property_obj,
                        floorNo=floor_no,
                        sectionNo=section.get("sectionNo"),
                        area_sqft=section.get("area")
                    )

    return Response(
        {
            "message": "Owner Registered Successfully",
            "gallery_images": gallery_file_paths
        },
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
            status=status.HTTP_201_CREATED
        )

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
                return Response(
                    {
                        "message": "Login Successful",
                        "tenant_id": tenant.id,
                        "name": tenant.name,
                        "email": tenant.email
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid Password"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Tenent.DoesNotExist:
            return Response(
                {"error": "Email not registered"},
                status=status.HTTP_404_NOT_FOUND
            )

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
                return Response(
                    {
                        "message": "Login Successful",
                        "owner_id": owner.id,
                        "email": owner.email,
                        "name": owner.name
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid Password"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Owners.DoesNotExist:
            return Response(
                {"error": "Owner not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_hostel_step3(request, email):
    try:
        owner = Owners.objects.get(email=email)
    except Owners.DoesNotExist:
        return Response({"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)

    hostel = StayHostelDetails.objects.filter(owner=owner).first()
    apartment = ApartmentStayDetails.objects.filter(owner=owner).first()
    commercial = CommericialDetails.objects.filter(owner=owner).first()

    response_data = {}

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

    elif commercial is not None:
        floors = CommercialFloor.objects.filter(commercial_property=commercial)

        layout = []
        for floor in floors:
            layout.append({
                "floorNo": floor.floorNo,
                "sectionNo": floor.sectionNo,
                "area_sqft": floor.area_sqft
            })

        response_data = {
            "property_type": "commercial",
            "building_layout": layout
        }

    else:
        return Response(
            {"error": "No property found for this owner"},
            status=status.HTTP_404_NOT_FOUND
        )

    response_data["owner"] = {
        "id": owner.id,
        "name": owner.name,
        "email": owner.email,
        "phone": owner.phone
    }

    print("API Response:", response_data)
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_properties_listing(request):
    property_list = []

    def build_gallery_urls(gallery_list):
        if not gallery_list:
            return []
        return [
            request.build_absolute_uri(settings.MEDIA_URL + path)
            for path in gallery_list
        ]

    hostels = StayHostelDetails.objects.select_related('owner').all()
    for hostel in hostels:
        property_list.append({
            "id": str(hostel.id),
            "type": "Hostel",
            "hostelType": hostel.hostelType.capitalize() if hostel.hostelType else None,
            "name": hostel.hostelName,
            "address": hostel.location,
            "contact": hostel.owner.phone if hostel.owner else None,
            "latitude": None,
            "longitude": None,
            "gallery": build_gallery_urls(hostel.gallery_images),
            "isAvailable": True,
            "rating": None,
            "facilities": hostel.facilities if hostel.facilities else [],
        })

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
            "latitude": None,
            "longitude": None,
            "gallery": build_gallery_urls(apartment.gallery_images),
            "isAvailable": True,
            "rating": None,
            "facilities": apartment.facilities if apartment.facilities else [],
            "allowedTenants": allowed_tenants,
        })

    commercials = CommericialDetails.objects.select_related('owner').all()
    for commercial in commercials:
        property_list.append({
            "id": str(commercial.id),
            "type": "Commercial",
            "name": commercial.commercialName,
            "address": commercial.location,
            "contact": commercial.owner.phone if commercial.owner else None,
            "latitude": None,
            "longitude": None,
            "gallery": build_gallery_urls(commercial.gallery_images),
            "isAvailable": True,
            "rating": None,
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
        return Response(
            {
                "message": "Tenant Added Successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_tenantsbeds(request):
    tenants = TenantBeds.objects.all()
    serializer = TenantSerializer(tenants, many=True)

    print("Tenant Data:", serializer.data)

    return Response(
        {
            "message": "Tenant list fetched successfully",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )
@api_view(['GET'])
def owner_admin_list(request):
    owners = Owners.objects.all().order_by('-id')

    data = []
    for owner in owners:
        data.append({
            "id": owner.id,
            "owner_name": owner.name,
            "phone": owner.phone,
            "email": owner.email,
            "properties": 1,
            "status": owner.status
        })

    return Response(
        {
            "count": len(data),
            "data": data
        },
        status=status.HTTP_200_OK
    )



@api_view(['GET'])
def get_owner_full_details(request, email):
    try:
        owner = Owners.objects.get(email=email)
    except Owners.DoesNotExist:
        return Response(
            {"error": "Owner not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    def build_file_url(file_field):
        if file_field:
            try:
                return request.build_absolute_uri(file_field.url)
            except Exception:
                return None
        return None

    def build_gallery_urls(gallery_list):
        if not gallery_list:
            return []
        return [
            request.build_absolute_uri(settings.MEDIA_URL + str(path))
            for path in gallery_list
        ]

    # ---------------- STEP 1 : OWNER DETAILS ----------------
    step1 = {
        "id": owner.id,
        "name": owner.name,
        "email": owner.email,
        "phone": owner.phone,
        "status": owner.status,
        "owner_img_field": build_file_url(owner.owner_img_field)
    }

    # ---------------- STEP 2 : PROPERTY + BANK DETAILS ----------------
    bank = BankDetails.objects.filter(owner=owner).first()

    bank_data = None
    if bank:
        bank_data = {
            "bankName": bank.bankName,
            "ifsc": bank.ifsc,
            "accountNo": bank.accountNo
        }

    property_data = None
    property_type = None

    hostel = StayHostelDetails.objects.filter(owner=owner).first()
    apartment = ApartmentStayDetails.objects.filter(owner=owner).first()
    commercial = CommericialDetails.objects.filter(owner=owner).first()

    # ---------------- STEP 3 : BUILDING LAYOUT ----------------
    building_layout = []

    if hostel:
        property_type = "hostel"
        property_data = {
            "id": hostel.id,
            "stayType": hostel.stayType,
            "hostelName": hostel.hostelName,
            "location": hostel.location,
            "hostelType": hostel.hostelType,
            "facilities": hostel.facilities if hostel.facilities else [],
            "owner_ship_proof": build_file_url(hostel.owner_ship_proof),
            "gallery_images": build_gallery_urls(hostel.gallery_images),
        }

        floors = HostelFloorRoom.objects.filter(hostel=hostel).order_by("floor", "roomNo")
        floor_map = {}

        for room in floors:
            if room.floor not in floor_map:
                floor_map[room.floor] = []

            floor_map[room.floor].append({
                "roomNo": room.roomNo,
                "beds": room.sharing
            })

        for floor_no, rooms in floor_map.items():
            building_layout.append({
                "floorNo": floor_no,
                "rooms": rooms
            })

    elif apartment:
        property_type = "apartment"
        property_data = {
            "id": apartment.id,
            "stayType": apartment.stayType,
            "apartmentName": apartment.apartmentName,
            "location": apartment.location,
            "tenantType": apartment.tenantType,
            "facilities": apartment.facilities if apartment.facilities else [],
            "owner_ship_proof": build_file_url(apartment.owner_ship_proof),
            "gallery_images": build_gallery_urls(apartment.gallery_images),
        }

        floors = ApartmentFloorUnit.objects.filter(apartment=apartment).order_by("floor", "flatNo")
        floor_map = {}

        for flat in floors:
            if flat.floor not in floor_map:
                floor_map[flat.floor] = []

            floor_map[flat.floor].append({
                "flatNo": flat.flatNo,
                "bhk": flat.bhk
            })

        for floor_no, flats in floor_map.items():
            building_layout.append({
                "floorNo": floor_no,
                "flats": flats
            })

    elif commercial:
        property_type = "commercial"
        property_data = {
            "id": commercial.id,
            "stayType": commercial.stayType,
            "commercialName": commercial.commercialName,
            "location": commercial.location,
            "usage": commercial.usage,
            "facilities": commercial.facilities if commercial.facilities else [],
            "owner_ship_proof": build_file_url(commercial.owner_ship_proof),
            "gallery_images": build_gallery_urls(commercial.gallery_images),
        }

        floors = CommercialFloor.objects.filter(
            commercial_property=commercial
        ).order_by("floorNo", "sectionNo")

        floor_map = {}

        for section in floors:
            if section.floorNo not in floor_map:
                floor_map[section.floorNo] = []

            floor_map[section.floorNo].append({
                "sectionNo": section.sectionNo,
                "area_sqft": section.area_sqft
            })

        for floor_no, sections in floor_map.items():
            building_layout.append({
                "floorNo": floor_no,
                "sections": sections
            })

    else:
        return Response(
            {"error": "No property found for this owner"},
            status=status.HTTP_404_NOT_FOUND
        )

    response_data = {
        "message": "Owner full details fetched successfully",
        "property_type": property_type,
        "step1": step1,
        "step2": {
            "property_details": property_data,
            "bank_details": bank_data
        },
        "step3": {
            "building_layout": building_layout
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_status(request):
    tenant_id = request.data.get("id")
    status_value = request.data.get("status")

    tenant = Tenent.objects.get(id=tenant_id)
    tenant.status = status_value
    tenant.save()

    return Response({"message": "Status updated"})

@api_view(['GET'])
def tenantdetails(request, email):
    tenants = Tenent.objects.filter(email=email)

    data = []
    for t in tenants:
        data.append({
            "id": t.id,
            "name": t.name,
            "phone": t.phone,
            "email": t.email,
            "gender": t.gender,
            "status": getattr(t, "status", "pending")
        })

    return Response(data)