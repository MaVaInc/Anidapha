from django.db import models
from django.utils import timezone
from .user import User
from .seed import Seed

class Plot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plant_name = models.CharField(max_length=255, blank=True, null=True, default='EMPTY')
    texture_url = models.CharField(max_length=255, blank=True, null=True, default='images/grunt.webp')
    planted_at = models.DateTimeField(blank=True, null=True)
    seed = models.ForeignKey(Seed, on_delete=models.SET_NULL, null=True, blank=True)

    def is_empty(self):
        return self.seed is None

    def plant_seed(self, seed):
        if not self.is_empty():
            raise ValueError("This plot is already occupied.")
        self.seed = seed
        self.plant_name = seed.name
        self.texture_url = f"/images/seeds/{seed.id}.webp"
        self.planted_at = timezone.now()
        self.save()

    def harvest(self):
        if self.is_empty():
            raise ValueError("This plot is empty.")
        harvested_seed = self.seed
        self.seed = None
        self.plant_name = None
        self.texture_url = None
        self.planted_at = None
        self.save()
        return harvested_seed

    def __str__(self):
        return f"Plot {self.id} for {self.user.username}"
