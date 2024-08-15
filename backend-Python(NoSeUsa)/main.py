# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
from lector import process_xml
import os


app = FastAPI()
UPLOAD_DIR = './uploads'
# Configurar el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a los orígenes permitidos (dominios específicos) en producción
    allow_credentials=True,
    allow_methods=["*"],  # Cambia esto si necesitas restringir los métodos HTTP permitidos
    allow_headers=["*"],  # Cambia esto si necesitas restringir los headers permitidos
)
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Crear el directorio de subida si no existe
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Guardar el archivo en el servidor
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Procesar el archivo guardado
        with open(file_path, 'rb') as file_content:
            # Pasar el contenido del archivo a process_xml
            from io import BytesIO
            file_like = BytesIO(file_content.read())
            gastos = process_xml(file_like)

        # Opcional: devolver la lista de gastos o un mensaje de éxito
        return JSONResponse(content={"message": "File processed successfully", "gastos": gastos}, status_code=200)
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
