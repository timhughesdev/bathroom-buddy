import logging
from django.http import HttpResponse

logger = logging.getLogger(__name__)

class CorsMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse()
            response['Access-Control-Allow-Origin'] = "*"
            response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response["Access-Control-Allow-Methods"] = "DELETE, POST, GET, OPTIONS, PUT"
            response.status_code = 200
            response['Content-Length'] = '0'
            response.content = b''
            logger.info("CORS Middleware applied for OPTIONS request")
            return response

        response = self.get_response(request)
        response['Access-Control-Allow-Origin'] = "*"
        response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        response["Access-Control-Allow-Methods"] = "DELETE, POST, GET, OPTIONS, PUT"
        logger.info("CORS Middleware applied for non-OPTIONS request")
        return response