from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Testimonial
from django.shortcuts import render, redirect, get_object_or_404
from .models import Cart, CartItem, Product
from .serializers import CartSerializer
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import ContactForm, ContactMessage
from .forms import RegisterForm
from django.http import JsonResponse
from django.db import connection
import requests




class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        quantity = int(request.data.get("quantity", 1))
        product_id = request.data.get("product_id")

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cartItem, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if created:
            cartItem.quantity = quantity
        else:
            cartItem.quantity += quantity

        cartItem.save()

        serializer = CartSerializer(cart)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        item_id = request.data.get("item_id")

    
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()

        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

def home(request):
    return render(request, 'home.html')


def cart(request):
    return render(request, 'cart.html')


def about(request):

    testimonials = Testimonial.objects.filter(
    is_active=True
     ).order_by("created_at")

    return render(
        request,
        "about.html",
        {
            "testimonials": testimonials
        }
    )

def testimonials(request):

    testimonials = Testimonial.objects.filter(
        is_active=True
    )

    return render(
        request,
        "testimonials.html",
        {
            "testimonials": testimonials
        }
    )


def category(request):
    return render(request, 'category.html')

from django.shortcuts import render
from .models import Product


def productDetails(request):

    product_id = request.GET.get("id")

    if not product_id:
        raise Http404("Product ID is required")

    try:
        response = requests.get(
            f"https://dummyjson.com/products/{product_id}",
            timeout=10
        )

        if response.status_code != 200:
            raise Http404("Product not found")

        product = response.json()

    except requests.RequestException:
        raise Http404("Unable to load product")

    return render(
        request,
        "productDetails.html",
        {
            "product": product
        }
    )
def cartb(request):
    return render(request, 'cartb.html')

@login_required(login_url="/login/")
def checkout(request):

    cart = Cart.objects.filter(
        user=request.user
    ).first()

    cart_items = []

    if cart:
        cart_items = CartItem.objects.filter(
            cart=cart
        ).select_related("product")

    subtotal = 0

    for item in cart_items:
        subtotal += item.product.price * item.quantity

    shipping = 0
    tax = 0
    total = subtotal + shipping + tax

    context = {
        "cart": cart,
        "cart_items": cart_items,
        "subtotal": subtotal,
        "shipping": shipping,
        "tax": tax,
        "total": total,
    }

    return render(
        request,
        "checkout.html",
        context
    )


def register(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":

        form = RegisterForm(request.POST)

        if form.is_valid():

            user = form.save()

            login(request, user)

            return redirect("home")

    else:
        form = RegisterForm()

    return render(
        request,
        "register.html",
        {
            "form": form
        }
    )

def login_view(request):

    if request.user.is_authenticated:
        return redirect("home")

    next_url = request.GET.get("next") or request.POST.get("next")

    if request.method == "POST":

        form = AuthenticationForm(
            request,
            data=request.POST
        )

        if form.is_valid():

            user = form.get_user()

            login(request, user)

            if next_url:
                return redirect(next_url)

            return redirect("home")

    else:

        form = AuthenticationForm()

    return render(
        request,
        "login.html",
        {
            "form": form,
            "next": next_url,
        }
    )

def logout_view(request):

    logout(request)

    return redirect("home")


def contact(request):
    return render(request, 'contact.html')


def contact_view(request):
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        subject = request.POST.get("subject", "").strip()
        message = request.POST.get("message", "").strip()

        if name and email and subject and message:
            ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message,
            )

            django_messages.success(
                request,
                "Your message has been sent."
            )

            return redirect("contact")

        else:
            django_messages.error(
                request,
                "Please fill in all fields."
            )

    return render(request, "contact.html")




def db_check(request):
    try:
        return JsonResponse({
            "database": connection.vendor,
            "name": str(connection.settings_dict["NAME"]),
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)