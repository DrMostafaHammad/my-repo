from network.models import *
from django.utils import timezone

def run():
    # create a post using code, note how to set author, note how you added liker
        # post = Post()
        # post.author = User.objects.get(id=2)
        # post.postcontent = "This is raw3a's first post"
        # post.timestamp = timezone.now()
        # post.save()
        # liker1 = User.objects.get(id=1)
        # liker2 = User.objects.get(id=3)
        # post.wholiked.add(liker1)
        # post.wholiked.add(liker2)
        # print(post.wholiked.count())
    

    # .all method returns queryset object. add.count() to get number
        # posts = Post.objects.all().count()
        # print(posts)
    

    # Instantiate follower, instantiate followees, save, print
        # desoks = User.objects.get(id=4)
        # raw3a = User.objects.get(id=2)
        # f = Following()
        # f.follower = desoks
        # f.followees = raw3a
        # f.save()
        # print(f)

    # identify user, get users id, filter following table with follower's id, print results. you can get followres and following from here
        # mos = User.objects.get(username='raw3a')
        # mosid = mos.id
        # print(mosid)
        # f = Following.objects.filter(follower_id=mosid)
        # for s in f:
        #     print(s)
        # print(f.count())
    posts = Post.objects.all()
    print(posts)