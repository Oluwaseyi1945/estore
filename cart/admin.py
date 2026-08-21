from django.contrib import admin
from .models import Cart, Product, CartItem
from .models import Testimonial

# Register your models here.

admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)



@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "role",
        "is_highlighted",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "is_highlighted",
    )

    search_fields = (
        "name",
        "role",
        "message",
    )