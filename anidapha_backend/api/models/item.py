from django.db import models
from .base import BaseItem

class Item(BaseItem):
    ITEM_TYPES = [
        ('weapon', 'Weapon'),
        ('armor', 'Armor'),
        ('helmet', 'Helmet'),
        ('shield', 'Shield'),
        ('boots', 'Boots'),
        ('pants', 'Pants'),
        ('gloves', 'Gloves'),
        ('ring', 'Ring'),
        ('amulet', 'Amulet'),
        ('accessory', 'Accessory'),
        ('potion', 'Potion'),
        ('scroll', 'Scroll'),
        ('material', 'Material'),
        ('quest_item', 'Quest Item'),
        ('stone', 'Stone'),
        ('other', 'Other'),
    ]
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, verbose_name="Тип")
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES, default='common')
    unique_properties = models.CharField(max_length=255, blank=True, verbose_name="Уникальные свойства")
    image = models.ImageField(upload_to='images/items/', blank=True, null=True, verbose_name="Изображение")

    attack = models.IntegerField(default=0, verbose_name="Атака", null=True, blank=True)
    defense = models.IntegerField(default=0, verbose_name="Броня", null=True, blank=True)
    accuracy = models.IntegerField(default=0, verbose_name="Точность", null=True, blank=True)
    evasion = models.IntegerField(default=0, verbose_name="Уворот", null=True, blank=True)
    stun = models.IntegerField(default=0, verbose_name="Оглушение", null=True, blank=True)
    block = models.IntegerField(default=0, verbose_name="Блок", null=True, blank=True)
    health = models.IntegerField(default=0, verbose_name="Жизни", null=True, blank=True)
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if not self.image:  # Если изображение не установлено вручную
            self.image = f'images/{self.name}.PNG'
        super().save(*args, **kwargs)