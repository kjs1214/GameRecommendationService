from django.db import models

# Create your models here.
from django.db import models

class Game(models.Model):
    game_id = models.IntegerField(primary_key=True)

class GameHistory(models.Model): 
    user = models.IntegerField()
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    total_play_game = models.IntegerField()

class GameSmall(models.Model):
    game_id = models.IntegerField(primary_key=True)

class Image(models.Model):
    type_id = models.IntegerField()
    url = models.URLField()

class Recommendation(models.Model):
    steam_id = models.IntegerField()
    game_id = models.IntegerField()
    rating = models.FloatField()
