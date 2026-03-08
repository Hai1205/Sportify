from rest_framework.permissions import AllowAny, IsAdminUser
from backend.permissions import IsArtistUser
from .serializers import *
from users.serializers import *
from rest_framework.generics import GenericAPIView
from .models import Album
from songs.models import Song
from backend.services import CloudinaryService
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Q

class UploadAlbumView(GenericAPIView):
    permission_classes = [IsAdminUser | IsArtistUser ]

    def post(self, request, userId):
        try:
            user = get_object_or_404(User, id=userId)
            
            title = request.data.get("title")
            thumbnail = request.FILES.get("thumbnail")
            
            if thumbnail is None:
                return JsonResponse({
                    "status": 400,
                    "message": "Thumbnail is required"
                    }, status=400)
            
            cloud_service = CloudinaryService()
            thumbnailUrl = cloud_service.upload_file(thumbnail)
            
            album = Album.objects.create(
                title=title,
                thumbnailUrl=thumbnailUrl
            )
            
            if user:
                user.albums.add(album)
                user.save()
            
            return JsonResponse({
                "status": 200,
                "message": "Created album successfully",
                "album": AlbumSerializer(album).data
            }, safe=False, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
    
class GetAllAlbumView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            albums = Album.objects.all()
            serializer = FullInfoAlbumSerializer(albums, many=True)
        
            return JsonResponse({
                "status": 200,
                "message": "Get all album successfully",
                "albums": serializer.data
            }, safe=False, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
            
class GetUserAlbums(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, userId):
        try:
            user = get_object_or_404(User, id=userId)
            albums = user.albums.all()
            
            serializer = FullInfoAlbumSerializer(albums, many=True)
        
            return JsonResponse({
                "status": 200,
                "message": "Get user albums successfully",
                "albums": serializer.data
            }, safe=False, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
    
class GetAlbumView(GenericAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, albumId):
        try:
            album = get_object_or_404(Album, id=albumId)
            serializer = FullInfoAlbumSerializer(album)
        
            return JsonResponse({
                "status": 200,
                "message": "Get album successfully",
                "album": serializer.data
            }, safe=False, status=200)
        except Album.DoesNotExist:
            return JsonResponse({
                "status": 404,
                "message": "Album not found"
            }, status=404)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)

class DeleteAlbumView(GenericAPIView):
    permission_classes = [IsAdminUser | IsArtistUser ]
    
    def delete(self, request, albumId, userId):
        try:
            album = get_object_or_404(Album, id=albumId)
            
            cloud_service = CloudinaryService()
            thumbnailUrl = album.thumbnailUrl
            cloud_service.delete_file(thumbnailUrl)
            
            if userId and userId != "None":
                user = get_object_or_404(User, id=userId)
                user.albums.remove(album)
                user.save()
                
            songs = album.songs.all()
            for song in songs:
                cloud_service.delete_file(song.thumbnailUrl)
                cloud_service.delete_file(song.audioUrl)
                cloud_service.delete_file(song.videoUrl)
                song.delete()
            
            album.delete()
        
            return JsonResponse({
                "status": 200,
                "message": "Deleted album successfully",
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
            
class updateAlbum(GenericAPIView):
    permission_classes = [IsAdminUser | IsArtistUser ]
    
    def put(self, request, albumId):
        try:
            import json
            album = get_object_or_404(Album, id=albumId)
            
            title = request.data.get("title")
            thumbnail = request.data.get("thumbnail")
            songIds = json.loads(request.data.get("songIds", "[]"))
            
            album.title = title 
            
            album.songs.clear()
            for songId in songIds:
                song = get_object_or_404(Song, id=songId)
                album.songs.add(song)
            
            if thumbnail is not None:
                cloud_service = CloudinaryService()
                thumbnailUrl = cloud_service.upload_file(thumbnail)
                album.thumbnailUrl = thumbnailUrl
            
            album.save()
            
            serializer = FullInfoAlbumSerializer(album)
            
            return JsonResponse({
                "status": 200,
                "message": "Updated album successfully",
                "album": serializer.data
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
            
class searchAlbums(GenericAPIView):
    permission_classes = [ AllowAny ]
    
    def get(self, request):
        try:
            query = request.GET.get('query')
            print(query)
            
            albums = Album.objects.filter(Q(title__icontains=query))
        
            serializer = FullInfoAlbumSerializer(albums, many=True)
        
            return JsonResponse({
                "status": 200,
                "message": "SearchSearch album successfully",
                "albums": serializer.data
            }, safe=False, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)
            
class LikeSongView(GenericAPIView):
    def post(self, request, userId, albumId):
        try:
            user = get_object_or_404(User, id=userId)
            album = get_object_or_404(Album, id=albumId)

            if album in user.likedAlbums.all():
                user.likedAlbums.remove(album)
                message = "unliked"
            else:
                user.likedAlbums.add(album)
                message = "liked"

            user.save()
            
            serializer = FullInfoUserSerializer(user)

            return JsonResponse({
                "status": 200,
                "message": f"User {message} album successfully",
                "user": serializer.data
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)


class AlbumDetailView(GenericAPIView):
    """GET = album detail, PUT = update album"""
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [(IsAdminUser | IsArtistUser)()]

    get = GetAlbumView.get
    put = updateAlbum.put


class UserAlbumsView(GenericAPIView):
    """GET = list user's albums, POST = upload album for user"""
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [(IsAdminUser | IsArtistUser)()]

    get = GetUserAlbums.get
    post = UploadAlbumView.post


class GetUserLikedAlbumView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, userId):
        try:
            user = get_object_or_404(User, id=userId)

            serializer = FullInfoAlbumSerializer(user.likedAlbums, many=True)
        
            return JsonResponse({
                "albums": 200,
                "message": "Get user liked albums successfully", 
                "albums": serializer.data
            }, safe=False, status=200)
        except Exception as e:
            return JsonResponse({
                "status": 500,
                "message": str(e)
            }, status=500)