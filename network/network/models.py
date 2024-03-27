from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="creator")
    postcontent = models.TextField(blank=False, editable=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    # get likes count from Likes model / or try likescount = Post.objects.filter(post_id=post_id), likescount.liked_set.all().count or put () around whats before count, or use related name likescount.total_likes.all().count
    wholiked = models.ManyToManyField("User", blank=True)

    def __str__(self):
        return f'{self.author} wrote: {self.postcontent} --on-- {self.timestamp}'


class Following(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    followees = models.ForeignKey("User", on_delete=models.CASCADE, blank=True, related_name='followee')

    class Meta:
        unique_together = ('follower', 'followees')

    def __str__(self):
        return f'{self.follower.username} follows: {self.followees.username}'



# class Followers(models.Model):
#     userbeingfollowed = models.ForeignKey("User", on_delete=models.CASCADE, related_name="userbfollowed")
#     followers = models.ManyToManyField("User", related_name="followers")



# class Likes(models.Model):
#     # to get number of likes, filter by post_id and count True by: filtered_count = Likes.objects.filter(liked=True).count()
#     # on the views like function, write Likes.object.create(user_id=user_id, post_id=post_id, liked=True) to REGISTER a like
#     # to unlike, unlike = Likes.objects.filter(user_id=user_id, post_id=post_id), unlike.liked = False, unlike.save()
#     user_id = models.ForeignKey("User", on_delete=models.CASCADE)
#     post_id = models.ForeignKey("Post", on_delete=models.CASCADE, related_name='total_likes')
#     liked = models.BooleanField(default=False)
    
