import os
import urllib.request
import urllib.parse
import json
import mimetypes
import time
from dotenv import load_dotenv
import base64
from google.oauth2 import service_account
import google.auth.transport.requests

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))

# Supabase Config
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment.")
    exit(1)

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

def main():
    print("Fetching products from Supabase using REST API...")
    try:
        req = urllib.request.Request(
            url=f"{SUPABASE_URL}/rest/v1/products?select=*",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            },
            method="GET"
        )
        with urllib.request.urlopen(req) as response:
            products = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Failed to query Supabase products: {e}")
        return
    
    if not products:
        print("No products found in the database.")
        return
        
    print(f"Found {len(products)} products in the database.")
    
    # Filter products that need enrichment (i.e. sub_description is null or empty)
    to_enrich = [p for p in products if not p.get("sub_description") or p.get("sub_description") == ""]
    
    if not to_enrich:
        print("All existing products already have sub_descriptions! No enrichment needed.")
        return
        
    print(f"Enriching {len(to_enrich)} products...")
    
    for product in to_enrich:
        product_id = product['product_id']
        name = product['name']
        category = product['category']
        image_url = product['cloudinary_image_url']
        
        print(f"\nProcessing product: {name} ({category})")
        print(f"Downloading image from Cloudinary: {image_url}")
        
        try:
            # Guess mime type from URL
            mime_type, _ = mimetypes.guess_type(image_url)
            if not mime_type:
                mime_type = 'image/jpeg'
                
            # Download image bytes
            req = urllib.request.Request(
                image_url, 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req) as img_response:
                image_bytes = img_response.read()
                
            print("Generating descriptions using Gemini API...")
            ai_desc = generate_saree_descriptions(image_bytes, category, name, mime_type)
            
            if ai_desc:
                desc = ai_desc.get("description")
                sub_desc = ai_desc.get("sub_description")
                
                print("Updating product in Supabase...")
                update_data = json.dumps({
                    "description": desc,
                    "sub_description": sub_desc
                }).encode('utf-8')
                
                update_req = urllib.request.Request(
                    url=f"{SUPABASE_URL}/rest/v1/products?product_id=eq.{product_id}",
                    data=update_data,
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json"
                    },
                    method="PATCH"
                )
                with urllib.request.urlopen(update_req) as update_response:
                    pass
                
                print(f"Successfully enriched: {name}")
            else:
                print(f"Skipping update for {name} (Gemini generation failed).")
                
        except Exception as e:
            print(f"Failed to process {name}: {e}")
            
        # Pacing delay (1.5s for safe request spacing)
        time.sleep(1.5)
            
    print("\nFinished enriching existing products!")

if __name__ == '__main__':
    main()
