from django.forms import *
from django import forms

from .models import *

class ProviderForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs['autofocus'] = True

    class Meta:
        model = Provider
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
            'ruc': forms.TextInput(attrs={'placeholder': 'Ingrese un número de ruc'}),
            'mobile': forms.TextInput(attrs={'placeholder': 'Ingrese un teléfono celular'}),
            'address': forms.TextInput(attrs={'placeholder': 'Ingrese una dirección'}),
            'email': forms.TextInput(attrs={'placeholder': 'Ingrese un email'}),
        }

    def save(self, commit=True):
        data = {}
        try:
            if self.is_valid():
                super().save()
            else:
                data['error'] = self.errors
        except Exception as e:
            data['error'] = str(e)
        return data


class ProductForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs['autofocus'] = True
        # self.fields['ncat'].queryset = Cat.objects.all()

    class Meta:
        model = Product
        # fields = 'name','marca', 'type','lcd', 'desc', 'price','priced','pricei','image'
        fields = 'name', 'nmar', 'ncat', 'ntic', 'desc', 'price', 'priced', 'pricei', 'image'
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),

            'ncat': forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'}),
            'nmar': forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'}),
            'ntic': forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'}),
            
            'desc': forms.Textarea(attrs={'placeholder': 'Ingrese una descripción', 'rows': 3, 'cols': 3}),
            'price': forms.TextInput(attrs={}),
            'priced': forms.TextInput(attrs={}),
        }
        exclude = ['stock']


    def save(self, commit=True):
        data = {}
        try:
            if self.is_valid():
                super().save()
            else:
                data['error'] = self.errors
        except Exception as e:
            data['error'] = str(e)
        return data

class ProductForm2(forms.Form):
        cat = forms.ModelChoiceField(queryset=Cat.objects.all(), widget=forms.Select(attrs={
        'class': 'form-control select2',
        'style': 'width: 100%'
    }))


class PurchaseForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['provider'].widget.attrs['autofocus'] = True

    class Meta:
        model = Purchase
        fields = '__all__'
        widgets = {
            'ninvoice': forms.TextInput(attrs={'class': 'form-control select2', 'style': 'width: 100%;'}),
            'provider': forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'}),
            'date_joined': forms.DateInput(format='%Y-%m-%d', attrs={
                'class': 'form-control datetimepicker-input',
                'id': 'date_joined',
                'value': datetime.now().strftime('%Y-%m-%d'),
                'data-toggle': 'datetimepicker',
                'data-target': '#date_joined'
            }),
            'subtotal': forms.TextInput(),
        }


class InventoryForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['purchase'].choices = self.get_dates()

    def get_dates(self):
        data = []
        data.append(('', '---------------'))
        for i in Purchase.objects.all():
            name = '{} / {} / {}'.format(format(i.id, '06d'), i.date_joined.strftime('%Y-%m-%d'), i.provider.name)
            data.append((int(i.id), name))
        return tuple(data)

    product = forms.ModelChoiceField(queryset=Product.objects.filter().order_by('-id'),
                                     widget=forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'
                                                                }))

    purchase = forms.ChoiceField(widget=forms.Select(attrs={'class': 'form-control select2', 'style': 'width: 100%;'
                                                            }))

class CatForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True

    class Meta:
        model = Cat
        # fields = 'name','marca', 'type','lcd', 'desc', 'price','priced','pricei','image'
        fields = '__all__'
        widgets = {
            'nombre': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
        }

class MarForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True

    class Meta:
        model = Marca
        # fields = 'name','marca', 'type','lcd', 'desc', 'price','priced','pricei','image'
        fields ='__all__'
        widgets = {
            'nombre': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
        }

class TipForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs['autofocus'] = True

    class Meta:
        model = TipoCat
        # fields = 'name','marca', 'type','lcd', 'desc', 'price','priced','pricei','image'
        fields = '__all__'
        widgets = {
            'nombre': forms.TextInput(attrs={'placeholder': 'Ingrese un nombre'}),
        }