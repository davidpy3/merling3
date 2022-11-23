from django.urls import path
from .views.provider.views import *
from .views.product.views import *
from .views.purchase.views import *

urlpatterns = [
    # provider
    path('provider/', ProviderListView.as_view(), name='provider_list'),
    path('provider/add/', ProviderCreateView.as_view(), name='provider_create'),
    path('provider/update/<int:pk>/', ProviderUpdateView.as_view(), name='provider_update'),
    path('provider/delete/<int:pk>/', ProviderDeleteView.as_view(), name='provider_delete'),
    
    # product
    path('product/', ProductListView.as_view(), name='product_list'),
    path('product/add/', ProductCreateView.as_view(), name='product_create'),
    path('product/update/<int:pk>/', ProductUpdateView.as_view(), name='product_update'),
    path('product/delete/<int:pk>/', ProductDeleteView.as_view(), name='product_delete'),

    #categoria
    path('cat/', CatListView.as_view(), name='cat_list'),
    path('cat/add', CatCreateView.as_view(), name='cat_create'),
    path('cat/update/<int:pk>/', CatUpdateView.as_view(), name='cat_update'),
    path('cat/delete/<int:pk>/', CatDeleteView.as_view(), name='cat_delete'),

     #marca
    path('mar/', MarListView.as_view(), name='mar_list'),
    path('mar/add', MarCreateView.as_view(), name='mar_create'),
    path('mar/update/<int:pk>/', MarUpdateView.as_view(), name='mar_update'),
    path('mar/delete/<int:pk>/', MarDeleteView.as_view(), name='mar_delete'),

     #cattipo
    path('tcat/', TCatListView.as_view(), name='tcat_list'),
    path('tcat/add', TCatCreateView.as_view(), name='tcat_create'),
    path('tcat/update/<int:pk>/', TCatUpdateView.as_view(), name='tcat_update'),
    path('tcat/delete/<int:pk>/', TCatDeleteView.as_view(), name='tcat_delete'),


    # purchases
    path('purchase/', PurchaseListView.as_view(), name='purchase_list'),
    path('purchase/add/', PurchaseCreateView.as_view(), name='purchase_create'),
    path('purchase/delete/<int:pk>/', PurchaseDeleteView.as_view(), name='purchase_delete'),


    #Filtros
    path('product2/', ProductList2View.as_view(), name='product_list2'),


]
