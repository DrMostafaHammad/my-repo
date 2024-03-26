from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    creator = models.ForeignKey("User", on_delete=models.CASCADE)
    postcontent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likescount = models.IntegerField(default=0)


class Followers(models.Model):
    userbeingfollowed = models.ForeignKey("User", on_delete=models.CASCADE, related_name="userbfollowed")
    followers = models.ManyToManyField("User", related_name="followers")


class Following(models.Model):
    userfollowing = models.ForeignKey("User", on_delete=models.CASCADE, related_name="usrfollowing")
    followeesbeingfollowed = models.ManyToManyField("User", related_name="followees")



class Likes(models.Model):
    liker = models.ForeignKey("User", on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    liked = models.BooleanField(default=False)
    

