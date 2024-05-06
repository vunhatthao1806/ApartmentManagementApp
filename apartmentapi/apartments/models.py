from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['id']


class User(AbstractUser):
    avatar = CloudinaryField(null=True)


class ECabinet(BaseModel):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name


class Flat(models.Model):
    floor = models.CharField(max_length=20)
    apartment_num = models.CharField(max_length=20, unique=True)
    block = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    e_cabinet = models.OneToOneField(ECabinet, on_delete=models.PROTECT, unique=True)

    def __str__(self):
        return self.apartment_num


class CarCard(BaseModel):
    type = models.CharField(max_length=100, unique=True)
    number_plate = models.CharField(max_length=20)
    flat = models.ForeignKey(Flat, on_delete=models.CASCADE)

    def __str__(self):
        return self.number_plate


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    status = models.BooleanField()
    name = models.CharField(max_length=255)
    e_cabinet = models.ForeignKey(ECabinet, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def status_text(self):
        return "received" if self.status else "dismissed"


class Receipt(BaseModel):
    title = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT)
    flat = models.ForeignKey(Flat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.title


class Survey(BaseModel):
    title = models.CharField(max_length=255)
    content = RichTextField()
    user = models.ManyToManyField(User)

    def __str__(self):
        return self.title


class Complaint(BaseModel):
    title = models.CharField(max_length=255)
    content = RichTextField()
    image = CloudinaryField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255)


class Like(Interaction):
    class Meta:
        unique_together = ('complaint', 'user')
