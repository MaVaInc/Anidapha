
from django.db import models
from django.utils import timezone
from datetime import timedelta

class Seed(models.Model):
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

    owner = models.ForeignKey('api.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    growth_time = models.DurationField(default=timedelta(hours=24))
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES, default='common')
    stage = models.CharField(max_length=10, choices=GROWTH_STAGES, default='seed')
    planted_at = models.DateTimeField(null=True, blank=True)

    def plant(self):
        """
        Сажает семя, устанавливая начальную стадию и время посадки.
        """
        self.stage = 'growing'
        self.planted_at = timezone.now()
        self.save()

    def update_stage(self):
        """
        Обновляет стадию роста семени на основе времени, прошедшего с момента посадки.
        """
        if self.stage == 'growing' and self.planted_at:
            elapsed_time = timezone.now() - self.planted_at
            if elapsed_time >= self.growth_time:
                self.stage = 'matured'
                self.save()

    def harvest(self):
        """
        Собирает урожай, переводя семя в состояние 'harvested'.
        """
        if self.stage == 'matured':
            self.stage = 'harvested'
            self.save()
            return True
        return False

    def time_until_matured(self):
        """
        Возвращает оставшееся время до созревания.
        """
        if self.stage == 'growing' and self.planted_at:
            elapsed_time = timezone.now() - self.planted_at
            remaining_time = self.growth_time - elapsed_time
            return max(remaining_time, timedelta(0))
        return timedelta(0)

    def __str__(self):
        return f"Seed {self.name} ({self.get_rarity_display()}) - Stage: {self.get_stage_display()} for {self.owner.username}"


