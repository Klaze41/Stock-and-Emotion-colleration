from django.db import models

# Create your models here.
class Test(models.Model):
    time = models.CharField(max_length=10000, default='default_value')
    value = models.CharField(max_length=20, default='default_value')

class Info(models.Model):
    title = models.CharField(max_length=10000, default='default_value')
    time = models.CharField(max_length=10000, default='default_value')
    detail = models.CharField(max_length=10000, default='default_value')
    