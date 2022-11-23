import json

from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from core.clinic.scm.forms import Product, ProductForm, ProductForm2,CatForm ,MarForm , TipForm
# from core.clinic.scm.forms import Product, ProductForm
from core.clinic.scm.models import *

from core.security.mixins import AccessModuleMixin, PermissionModuleMixin

from django.views.generic import TemplateView


class ProductListView(AccessModuleMixin, PermissionModuleMixin, ListView):
    model = Product
    template_name = 'product/list.html'
    permission_required = 'view_product'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('product_create')
        context['title'] = 'Listado de Producto'
        return context

class CatListView(AccessModuleMixin, ListView):
    model = Cat
    template_name = 'product/listcat.html'
    # permission_required = 'view_product'
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('cat_create')
        context['title'] = 'Listado de Categorias'
        return context

class MarListView(AccessModuleMixin, ListView):
    model = Marca
    template_name = 'product/listmar.html'
    # permission_required = 'view_product'
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('mar_create')
        context['title'] = 'Listado de Marcas'
        return context

class TCatListView(AccessModuleMixin, ListView):
    model = TipoCat
    template_name = 'product/listtcat.html'
    # permission_required = 'view_product'
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('tcat_create')
        context['title'] = 'Listado de Tipo Categorias'
        return context

class ProductCreateView(AccessModuleMixin, PermissionModuleMixin, CreateView):
    model = Product
    template_name = 'product/create.html'
    form_class = ProductForm
    success_url = reverse_lazy('product_list')
    permission_required = 'add_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
            ncat = self.request.POST['ncat']
            nmar = self.request.POST['nmar']
            ntic = self.request.POST['ntic']
            name = self.request.POST['name'].strip()
            if len(name) and len(ncat) and len(nmar) and len(ntic):
            # if len(name):
                if Product.objects.filter(name__iexact=name):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action', None)
        try:
            if action == 'add':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Producto'
        context['action'] = 'add'
        return context

class CatCreateView(AccessModuleMixin, CreateView):
    model = Cat
    template_name = 'product/createcat.html'
    form_class = CatForm
    success_url = reverse_lazy('cat_list')
    # permission_required = 'add_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una Categoria'
        context['action'] = 'add'
        return context

class MarCreateView(AccessModuleMixin, CreateView):
    model = Marca
    template_name = 'product/createmar.html'
    form_class = MarForm
    success_url = reverse_lazy('mar_list')
    # permission_required = 'add_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una Categoria'
        context['action'] = 'add'
        return context

class TCatCreateView(AccessModuleMixin, CreateView):
    model = TipoCat
    template_name = 'product/createtcat.html'
    form_class = TipForm
    success_url = reverse_lazy('tcat_list')
    # permission_required = 'add_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Tipo de Categoria'
        context['action'] = 'add'
        return context

class ProductUpdateView(AccessModuleMixin, PermissionModuleMixin, UpdateView):
    model = Product
    template_name = 'product/create.html'
    form_class = ProductForm
    success_url = reverse_lazy('product_list')
    permission_required = 'change_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            marca = self.request.POST['marca']
            lcd = self.request.POST['lcd']
            name = self.request.POST['name'].strip()
            id = self.get_object().id
            if len(name) and len(type):
                if Product.objects.filter(name__iexact=name, type=type).exclude(id=id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action', None)
        try:
            if action == 'edit':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Producto'
        context['action'] = 'edit'
        return context

class CatUpdateView(AccessModuleMixin, UpdateView):
    model = Cat
    template_name = 'product/createcat.html'
    form_class = CatForm
    success_url = reverse_lazy('cat_list')
    # permission_required = 'change_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
          
            nombre = self.request.POST['nombre'].strip()
            id = self.get_object().id
            if len(nombre) :
                if Cat.objects.filter(name__iexact=nombre).exclude(id=id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action', None)
        try:
            if action == 'edit':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Categoria'
        context['action'] = 'edit'
        return context

class MarUpdateView(AccessModuleMixin, UpdateView):
    model = Marca
    template_name = 'product/createmar.html'
    form_class = MarForm
    success_url = reverse_lazy('mar_list')
    # permission_required = 'change_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
          
            nombre = self.request.POST['nombre'].strip()
            id = self.get_object().id
            if len(nombre) :
                if Cat.objects.filter(name__iexact=nombre).exclude(id=id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action', None)
        try:
            if action == 'edit':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Marca'
        context['action'] = 'edit'
        return context

class TCatUpdateView(AccessModuleMixin,  UpdateView):
    model = TipoCat
    template_name = 'product/createtcat.html'
    form_class = TipForm
    success_url = reverse_lazy('tcat_list')
    # permission_required = 'change_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
          
            nombre = self.request.POST['nombre'].strip()
            id = self.get_object().id
            if len(nombre) :
                if Cat.objects.filter(name__iexact=nombre).exclude(id=id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action', None)
        try:
            if action == 'edit':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Tipo Categoria'
        context['action'] = 'edit'
        return context

class ProductDeleteView(AccessModuleMixin, PermissionModuleMixin, DeleteView):
    model = Product
    template_name = 'product/delete.html'
    success_url = reverse_lazy('product_list')
    permission_required = 'delete_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context

class CatDeleteView(AccessModuleMixin, DeleteView):
    model = Cat
    template_name = 'product/deletecat.html'
    success_url = reverse_lazy('cat_list')
    # permission_required = 'delete_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context

class MarDeleteView(AccessModuleMixin, DeleteView):
    model = Marca
    template_name = 'product/deletemar.html'
    success_url = reverse_lazy('mar_list')
    # permission_required = 'delete_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context

class TCatDeleteView(AccessModuleMixin, DeleteView):
    model = TipoCat
    template_name = 'product/deletetcat.html'
    success_url = reverse_lazy('mar_list')
    # permission_required = 'delete_product'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context
# class ProductList2View(AccessModuleMixin, PermissionModuleMixin, ListView):



class ProductList2View(TemplateView):

    form_class = ProductForm2
    template_name = 'product/list2.html'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST('action')
        # action = request.POST.get('action', None)
        try:
            if action == 'search_cat':
                data = []
                categorias = request.POST['categorias']
                search = Product.objects.all().order_by('categorias')
                if len(categorias):
                    search = search.filter(cat__id=categorias)
                for c in search:
                    data.append(c.toJSON())
            else:
                data[error]='ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Categoria De Productos'
        # context['entity'] = 'Product'
        context['form'] = ProductForm2()
        
        return context
