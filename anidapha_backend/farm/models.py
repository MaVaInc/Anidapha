from django.db import models
from django.utils import timezone

class Plot(models.Model):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE)
    plot_id = models.IntegerField()
    plant_name = models.CharField(max_length=255, blank=True, null=True)
    texture_url = models.CharField(max_length=255, blank=True, null=True)
    planted_at = models.DateTimeField(blank=True, null=True)

    def is_empty(self):
        return self.plant_name is None

    def __str__(self):
        return f"Plot {self.plot_id} for {self.user.username}"

class Seed(models.Model):
    owner = models.ForeignKey('api.User', on_delete=models.CASCADE)
    name = models.CharField( max_length=255)

    def __str__(self):
        return f"Seed {self.name} for {self.owner.username}"
