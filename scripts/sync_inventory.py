import os
import time
import uuid
import cloudinary
import cloudinary.uploader
from supabase import create_client, Client
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))

# ==========================================
# CONFIGURATION & SECRETS (Use Environment Variables in Production)
# ==========================================

# Supabase Config
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "your_supabase_url")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "your_supabase_service_role_key") # Need service role to bypass RLS for inserts
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

def process_and_upload(drive_service, drive_file):
    """Downloads from Drive, Uploads to Cloudinary, and Inserts into Supabase."""
    file_id = drive_file['id']
    file_name = drive_file['name']
    category = drive_file.get('category', 'Soft Silk')
    product_name = file_name.split('.')[0].replace('_', ' ').replace('-', ' ').title()
    
    # 1. Check if this product already exists in Supabase
    existing = supabase.table("products").select("product_id").eq("name", product_name).execute()
    if existing.data:
        print(f"Skipping {product_name} - already exists in Supabase.")
        return

    print(f"Processing {file_name} in category {category}...")
    
    # 2. Download from Google Drive
    try:
        image_stream = download_image(drive_service, file_id)
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
    
    # 4. Insert into Supabase
    sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"
    
    new_product = {
        "sku": sku,
        "name": product_name,
        "description": f"Beautiful {category} saree just arrived.",
        "category": category,
        "price": 25000.00,
        "stock_quantity": 1,
        "cloudinary_image_url": image_url
    }
    
    try:
        response = supabase.table("products").insert(new_product).execute()
        print(f"Added to Supabase: {sku} ({category})")
    except Exception as e:
        print(f"Failed to add {sku} to Supabase: {e}")

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
