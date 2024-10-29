from django.db import models
from .base import BaseItem
from django.utils import timezone
from datetime import timedelta

class Seed(BaseItem):
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    GROWTH_STAGES = [
        ('seed', 'Seed'),
        ('growing', 'Growing'),
        ('matured', 'Matured'),
        ('harvested', 'Harvested'),
    ]

    growth_time = models.DurationField(default=timedelta(hours=24))
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES, default='common')
    stage = models.CharField(max_length=10, choices=GROWTH_STAGES, default='seed')
    planted_at = models.DateTimeField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    image = models.ImageField(upload_to='images/plants/', blank=True, null=True, verbose_name="Изображение")

    def save(self, *args, **kwargs):
        if not self.image:  # Если изображение не установлено вручную
            self.image = 'images/plants/seed.png'
        super().save(*args, **kwargs)

    def plant(self):
        self.stage = 'growing'
        self.planted_at = timezone.now()
        self.save()

    def update_stage(self):
        if self.stage == 'growing' and self.planted_at:
            elapsed_time = timezone.now() - self.planted_at
            if elapsed_time >= self.growth_time:
                self.stage = 'matured'
                self.save()

    def harvest(self):
        if self.stage == 'matured':
            self.stage = 'harvested'
            self.save()
            return True
        return False

    def time_until_matured(self):
        if self.stage == 'growing' and self.planted_at:
            elapsed_time = timezone.now() - self.planted_at
            remaining_time = self.growth_time - elapsed_time
            return max(remaining_time, timedelta(0))
        return timedelta(0)
