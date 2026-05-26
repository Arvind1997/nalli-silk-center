import os
import time
import uuid
import json
import mimetypes
import urllib.request
import urllib.parse
import cloudinary
import cloudinary.uploader
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import base64
import google.auth.transport.requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))

# ==========================================
# CONFIGURATION & SECRETS (Use Environment Variables in Production)
# ==========================================

# Supabase Config
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "your_supabase_url")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "your_supabase_service_role_key") # Need service role to bypass RLS for inserts

# Cloudinary Config
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", "your_cloud_name"),
    api_key=os.environ.get("CLOUDINARY_API_KEY", "your_api_key"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", "your_api_secret")
)

# Google Drive Config
# The ID of the specific folder you drop images into.
# You get this from the URL: drive.google.com/drive/folders/<FOLDER_ID>
DRIVE_FOLDER_ID = os.environ.get("DRIVE_FOLDER_ID", "your_drive_folder_id")
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'service_account.json') # Path to your GCP Service Account JSON

# ==========================================

def get_drive_service():
    """Authenticates and returns the Google Drive API service."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=['https://www.googleapis.com/auth/drive.readonly'])
    return build('drive', 'v3', credentials=creds)

def fetch_images_recursively(drive_service, folder_id, folder_name="Uncategorized"):
    """Recursively fetches images from Google Drive folders."""
    print(f"Scanning folder: {folder_name} (ID: {folder_id})")
    
    # 1. Get all files and subfolders in the current folder
    query = f"'{folder_id}' in parents and trashed=false"
    results = drive_service.files().list(
        q=query, 
        fields="nextPageToken, files(id, name, mimeType)"
    ).execute()
    items = results.get('files', [])
    
    all_images = []
    
    for item in items:
        if item['mimeType'] == 'application/vnd.google-apps.folder':
            # It's a folder, go deeper
            # We pass the current folder's name as the category for its children
            all_images.extend(fetch_images_recursively(drive_service, item['id'], item['name']))
        elif 'image/' in item['mimeType']:
            # It's an image, add it to our list with the current folder name as category
            item['category'] = folder_name
            all_images.append(item)
            
    return all_images

def download_image(drive_service, file_id):
    """Downloads an image from Google Drive into memory."""
    request = drive_service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    fh.seek(0)
    return fh

SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'service_account.json')

def get_vertex_token_and_project():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"Service account file not found at {SERVICE_ACCOUNT_FILE}")
        return None, None
        
    try:
        with open(SERVICE_ACCOUNT_FILE, 'r') as f:
            sa_data = json.load(f)
            project_id = sa_data.get("project_id")
            
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        auth_req = google.auth.transport.requests.Request()
        creds.refresh(auth_req)
        return creds.token, project_id
    except Exception as e:
        print("Failed to authenticate with GCP service account:", e)
        return None, None

def generate_saree_descriptions(image_bytes, category, product_name, mime_type='image/jpeg'):
    """Uses Vertex AI REST API to analyze the saree image and generate descriptions using gemini-2.5-flash."""
    token, project_id = get_vertex_token_and_project()
    if not token or not project_id:
        print("Vertex AI authentication failed: Service account token or project ID is missing.")
        return None
        
    region = "us-central1"
    model_name = "gemini-2.5-flash"
    url = f"https://{region}-aiplatform.googleapis.com/v1/projects/{project_id}/locations/{region}/publishers/google/models/{model_name}:generateContent"
    
    # Base64 encode image bytes
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = f"""
    You are a luxury copywriter for Nalli Silk Center, a legendary premium handloom saree brand since 1928.
    Analyze this image of a saree in the category "{category}" and named "{product_name}".
    
    Provide a JSON response with the following keys:
    - "description": A concise, engaging description (1-2 sentences) specific to the styling, design, and colors visible in this image. Avoid generic platitudes; focus on what makes this specific piece unique.
    - "sub_description": A very brief phrase (strictly 4 to 5 words max) summarizing what the saree is, using technical textile-related terminology (e.g., zari, buttas, brocade, checks, warp, weft, pallu, temple border, jacquard) rather than generic adjectives. Do not write a full sentence.
    
    Format the response strictly as JSON:
    {{
        "description": "...",
        "sub_description": "..."
    }}
    Do not include any Markdown formatting (like ```json) or extra text.
    """
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt
                    },
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": encoded_image
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    max_retries = 3
    base_delay = 5
    
    for attempt in range(max_retries):
        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url=url,
                data=data,
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req) as response:
                resp_body = response.read().decode("utf-8")
                resp_json = json.loads(resp_body)
                
                text = resp_json['candidates'][0]['content']['parts'][0]['text'].strip()
                if text.startswith("```"):
                    text = text.replace("```json", "").replace("```", "").strip()
                    
                return json.loads(text)
        except urllib.error.HTTPError as he:
            error_code = he.code
            try:
                error_body = he.read().decode("utf-8")
            except Exception:
                error_body = ""
                
            print(f"Vertex AI HTTP Error {error_code}: {error_body if error_body else he.reason}")
            
            # Handle permission denied / incorrect role
            if error_code == 403:
                print("\n[CRITICAL ERROR] Vertex AI permission denied (403).")
                print("Please ensure the service account drive-sync-bot@nalli-inventory-sync.iam.gserviceaccount.com has the 'Vertex AI User' role (roles/aiplatform.user) in your GCP project.")
                print("Exiting script.")
                os._exit(1)
                
            # Handle rate limit (429)
            if error_code == 429:
                delay = base_delay * (2 ** attempt)
                print(f"   [Rate Limit Hit] Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"Vertex AI request failed: {he.reason}")
                return None
        except Exception as e:
            print(f"Vertex AI parsing/request failed for {product_name}: {e}")
            return None
            
    print(f"Vertex AI failed after {max_retries} attempts.")
    return None

def process_and_upload(drive_service, drive_file):
    """Downloads from Drive, Uploads to Cloudinary, and Inserts into Supabase."""
    file_id = drive_file['id']
    file_name = drive_file['name']
    category = drive_file.get('category', 'Soft Silk')
    product_name = file_name.split('.')[0].replace('_', ' ').replace('-', ' ').title()
    
    # 1. Check if this product already exists in Supabase using direct REST call
    try:
        encoded_name = urllib.parse.quote(product_name)
        url = f"{SUPABASE_URL}/rest/v1/products?select=product_id&name=eq.{encoded_name}"
        req = urllib.request.Request(
            url=url,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            },
            method="GET"
        )
        with urllib.request.urlopen(req) as response:
            existing_data = json.loads(response.read().decode('utf-8'))
        
        if existing_data:
            print(f"Skipping {product_name} - already exists in Supabase.")
            return
    except Exception as e:
        print(f"Error checking existing product in Supabase: {e}")
        return

    print(f"Processing {file_name} in category {category}...")
    
    # 2. Download from Google Drive
    try:
        image_stream = download_image(drive_service, file_id)
        image_bytes = image_stream.getvalue()
        # Reset position so Cloudinary can read from it
        image_stream.seek(0)
    except Exception as e:
        print(f"Failed to download {file_name}: {e}")
        return
    
    # 3. Upload to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(image_stream, public_id=file_name.split('.')[0])
        image_url = upload_result.get('secure_url')
        print(f"Uploaded to Cloudinary: {image_url}")
    except Exception as e:
        print(f"Failed to upload {file_name} to Cloudinary: {e}")
        return
    
    # 4. Generate AI descriptions using Gemini API
    mime_type, _ = mimetypes.guess_type(file_name)
    if not mime_type:
        mime_type = 'image/jpeg'
        
    ai_descriptions = generate_saree_descriptions(image_bytes, category, product_name, mime_type)
    if ai_descriptions:
        desc = ai_descriptions.get("description", f"Beautiful handwoven {category} saree. A perfect blend of heritage and style.")
        sub_desc = ai_descriptions.get("sub_description", f"Features an elegant finish, traditional weave pattern, and signature borders that highlight the rich craftsmanship of this {category} masterpiece.")
    else:
        desc = f"Beautiful handwoven {category} saree. A perfect blend of heritage and style."
        sub_desc = f"Features an elegant finish, traditional weave pattern, and signature borders that highlight the rich craftsmanship of this {category} masterpiece."

    # 5. Insert into Supabase
    sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"
    
    new_product = {
        "sku": sku,
        "name": product_name,
        "description": desc,
        "sub_description": sub_desc,
        "category": category,
        "price": 25000.00,
        "stock_quantity": 1,
        "cloudinary_image_url": image_url
    }
    
    try:
        data = json.dumps(new_product).encode('utf-8')
        req = urllib.request.Request(
            url=f"{SUPABASE_URL}/rest/v1/products",
            data=data,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            pass
        print(f"Added to Supabase: {sku} ({category})")
    except Exception as e:
        print(f"Failed to add {sku} to Supabase: {e}")
        
    # Pacing delay (1.5s for safe request spacing)
    time.sleep(1.5)

def main():
    try:
        drive_service = get_drive_service()
        print(f"Starting recursive sync from root folder: {DRIVE_FOLDER_ID}")
        files = fetch_images_recursively(drive_service, DRIVE_FOLDER_ID)
        
        if not files:
            print("No images found in the specified folder or its subfolders.")
            return
            
        print(f"Found {len(files)} images to process.")
        for file in files:
            process_and_upload(drive_service, file)
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()
