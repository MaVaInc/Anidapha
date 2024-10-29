from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BaseItem(models.Model):
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    name = models.CharField(max_length=100, verbose_name="Название")
    creator = models.CharField(max_length=255, verbose_name="Создатель", default='System')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)ss', verbose_name="Владелец")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Цена")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    description = models.TextField(blank=True, null=True, default='None')
    item_type = models.CharField(null=True, blank=True, default='None')

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}"