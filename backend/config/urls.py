from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import Http404, HttpResponse
from django.urls import include, path


def serve_frontend_app(_request):
    try:
        with staticfiles_storage.open("admin_command_center/index.html") as index_file:
            return HttpResponse(index_file.read(), content_type="text/html")
    except FileNotFoundError as exc:
        raise Http404("Frontend build missing. Run npm run build inside frontend/") from exc


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/command-center/", include("admin_command_center.api.urls")),
    path("", serve_frontend_app, name="command-center-frontend"),
]
