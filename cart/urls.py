from django.urls import path
from .views import CartDetailView, AddToCartView, RemoveFromCartView
from . import views





urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart'),
      path("", views.home, name='home'),
      path("about/", views.about, name="about"),
       path("category/", views.category, name="category"),
            path("cartb/", views.cartb, name="cartb"),
              path("checkout/", views.checkout, name="checkout"),
                 path( "Register/", views.register, name="register"),
                 path("login/",views.login_view, name="login"),
           path("logout/",views.logout_view,name="logout"),
            path("contact/",views.contact_view,name="contact"),
     path("product-details/",views.productDetails,name="product_details"),
    path('cart/add', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove', RemoveFromCartView.as_view(), name='remove-from-cart'),


]