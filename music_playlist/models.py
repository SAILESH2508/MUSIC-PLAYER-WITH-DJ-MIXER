from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    album = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=10)  # Example: "3:45"
    image = models.ImageField(upload_to='song_images/', blank=True, null=True)
    song_file = models.FileField(upload_to='songs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"
