from django.db import models
from .base import BaseItem

class Resource(BaseItem):
    RESOURCE_TYPES = [
        ('stone', 'Stone'),
        ('iron', 'Iron'),
        ('wood', 'Wood'),
        ('gold', 'Gold'),
        ('silver', 'Silver'),
        ('copper', 'Copper'),
        ('platinum', 'Platinum'),
        ('crystal', 'Crystal'),
        ('herb', 'Herb'),
        ('gemstone', 'Gemstone'),
        ('fabric', 'Fabric'),
        ('leather', 'Leather'),
        ('bone', 'Bone'),
        ('clay', 'Clay'),
        ('other', 'Other'),
    ]

    INITIAL_RARITY = {
        'stone': 'common',
        'wood': 'common',
        'iron': 'common',
        'copper': 'uncommon',
        'silver': 'uncommon',
        'gold': 'rare',
        'crystal': 'rare',
        'platinum': 'epic',
        'gemstone': 'epic',
        'herb': 'uncommon',
        'fabric': 'common',
        'leather': 'common',
        'bone': 'common',
        'clay': 'common',
        'other': 'common',
    }

    item_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, verbose_name="Тип ресурса", default='stone')
    rarity = models.CharField(max_length=10, choices=BaseItem.RARITY_CHOICES, verbose_name="Редкость", default='common')
    description = models.TextField(blank=True, verbose_name="Описание")
    items_created = models.ManyToManyField('Item', related_name='resources_used', blank=True, verbose_name="Что можно создать")
    image = models.ImageField(upload_to='images/resources/', blank=True, null=True, verbose_name="Изображение")

    def save(self, *args, **kwargs):
        if not self.pk:  # Проверка на создание нового объекта
            # Проверка на наличие INITIAL_RARITY и item_type
            if hasattr(self, 'INITIAL_RARITY') and hasattr(self, 'item_type'):
                self.rarity = self.INITIAL_RARITY.get(self.item_type, 'common')
            else:
                self.rarity = 'common'  # Установите значение по умолчанию, если INITIAL_RARITY или item_type отсутствуют

            # Установка пути к изображению
            if hasattr(self, 'item_type'):
                self.image = f'images/resources/{self.item_type}.png'
            else:
                self.image = 'images/resource/default.png'  # Установите значение по умолчанию, если item_type отсутствует
        super().save(*args, **kwargs)
