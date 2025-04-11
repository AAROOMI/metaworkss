# main.py
from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend access (add more origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev use "*", for production use specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to use new credentials first, fall back to old ones if not available
D_ID_API_KEY = os.getenv("NEW_DID_API_KEY") or os.getenv("DID_API_KEY")
DID_AGENT_ID = os.getenv("NEW_DID_AGENT_ID") or os.getenv("DID_AGENT_ID")
DID_CLIENT_KEY = os.getenv("NEW_DID_CLIENT_KEY") or os.getenv("DID_CLIENT_KEY")

# Middleware for error handling
@app.middleware("http")
async def exception_handling_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Server Error: {str(e)}"}
        )

# Function to verify authentication
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Here you would validate the token with Clerk
    # For now, we'll skip actual validation since we're focusing on the D-ID integration
    # In production, use the Clerk SDK to validate the token
    
    return True  # Return the validated token or user information

@app.get("/")
async def root():
    return {"message": "MetaWorks API is running"}

@app.get("/api/did/config")
async def get_did_config():
    """Get D-ID configuration for the frontend."""
    if not DID_AGENT_ID or not DID_CLIENT_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID credentials")
    
    return {
        "scriptUrl": "https://agent.d-id.com/v1/index.js",
        "agentConfig": {
            "agentId": DID_AGENT_ID,
            "clientKey": DID_CLIENT_KEY,
            "monitor": True,
            "mode": "fabio"
        }
    }

@app.get("/api/did-config")
async def get_did_config_for_standalone():
    """Get D-ID configuration for the standalone frontend."""
    if not DID_AGENT_ID or not DID_CLIENT_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID credentials")
    
    return {
        "agentId": DID_AGENT_ID,
        "clientKey": DID_CLIENT_KEY,
        "baseURL": "https://app2.d-id.com/"
    }

@app.get("/api/did/share-url")
async def get_did_share_url():
    """Get a D-ID share URL for external window usage."""
    if not DID_AGENT_ID or not DID_CLIENT_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID credentials")
    
    share_url = f"https://studio.d-id.com/agents/share?id={DID_AGENT_ID}&utm_source=copy&key={DID_CLIENT_KEY}"
    return {"shareUrl": share_url}

@app.get("/api/did/agent/{agent_id}")
async def get_agent(agent_id: str):
    """Proxy for getting D-ID agent information."""
    if not D_ID_API_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID API key")
    
    headers = {
        "Authorization": f"Basic {D_ID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    url = f"https://api.d-id.com/agents/{agent_id}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"D-ID API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/did/initialize")
async def initialize_session():
    """Initialize a new D-ID session."""
    if not D_ID_API_KEY or not DID_AGENT_ID:
        raise HTTPException(status_code=500, detail="Missing D-ID credentials")
    
    headers = {
        "Authorization": f"Basic {D_ID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "source_url": "presenter_id:Noelle",
        "agent_id": DID_AGENT_ID,
        "driver_id": "mzmtwlxz7b"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.d-id.com/talks/streams", 
                headers=headers,
                json=data
            )
            response.raise_for_status()
            response_data = response.json()
            return {
                "streamId": response_data.get("id"),
                "sessionId": response_data.get("session_id")
            }
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"D-ID API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/did/proxy/{path:path}")
async def proxy_did_request(path: str, request: dict, authenticated: bool = Depends(verify_token)):
    """Generic proxy for D-ID API requests with authentication."""
    if not D_ID_API_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID API key")
    
    headers = {
        "Authorization": f"Basic {D_ID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"Proxying authenticated D-ID API request to {path}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"https://api.d-id.com/{path}", 
                headers=headers,
                json=request
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_detail = "Unknown error"
            try:
                error_detail = e.response.json()
            except:
                error_detail = e.response.text
                
            raise HTTPException(
                status_code=e.response.status_code,
                detail={"message": "D-ID API error", "details": error_detail}
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail={"message": "Internal server error", "details": str(e)})

@app.post("/api/did/secure-agent")
async def get_secure_agent(request: Request, authenticated: bool = Depends(verify_token)):
    """Get secure D-ID agent configuration after authentication."""
    if not DID_AGENT_ID or not DID_CLIENT_KEY:
        raise HTTPException(status_code=500, detail="Missing D-ID credentials")
    
    # This endpoint requires authentication, so only authenticated users can get the agent config
    try:
        body = await request.json()
        # You could log the user's request here
        print(f"Secure agent request: {body}")
        
        return {
            "agentId": DID_AGENT_ID,
            "clientKey": DID_CLIENT_KEY,
            "scriptUrl": "https://agent.d-id.com/v1/index.js",
            "mode": "fabio",
            "monitor": True
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Run the server with uvicorn (using port 5001 to avoid conflict with Express)
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)