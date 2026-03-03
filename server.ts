import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
export default app;
const PORT = 3000;

app.use(express.json());

const SMM_API_KEY = (process.env.SMM_API_KEY || "dc906d24e90ac3cd272586ea2a3d3b30").trim();
const SMM_API_URL = (process.env.SMM_API_URL || "https://motherpanel.com/api/v2").trim().replace(/\/$/, "");

// API routes
app.get("/api/health", async (req, res) => {
  let publicIp = 'unknown';
  try {
    const ipRes = await axios.get('https://api.ipify.org?format=json', { timeout: 2000 });
    publicIp = ipRes.data.ip;
  } catch (e) {
    console.error("Failed to get public IP");
  }

  res.json({ 
    status: "ok", 
    smm_url: SMM_API_URL, 
    key_preview: SMM_API_KEY ? `${SMM_API_KEY.substring(0, 4)}...` : 'not set',
    server_ip: publicIp
  });
});

app.get("/api/services", async (req, res) => {
  try {
    console.log(`Fetching services from: ${SMM_API_URL} using key starting with: ${SMM_API_KEY.substring(0, 4)}...`);
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'services');

    const response = await axios.post(SMM_API_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'SMM-Panel-Client/1.0'
      },
      timeout: 15000
    });

    if (response.data && response.data.error) {
      console.error("SMM Provider error (Services):", response.data.error);
      return res.status(400).json({ 
        error: typeof response.data.error === 'string' ? response.data.error : JSON.stringify(response.data.error),
        raw: response.data 
      });
    }

    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("SMM API Error (Services):", error.response.status, error.response.data);
      res.status(error.response.status).json({ 
        error: `SMM Provider Error (${error.response.status})`, 
        details: error.response.data,
        message: typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)
      });
    } else {
      console.error("SMM API Error (Services):", error.message);
      res.status(500).json({ error: "Failed to connect to SMM provider", message: error.message });
    }
  }
});

app.post("/api/order", async (req, res) => {
  const { service, link, quantity } = req.body;
  
  if (!service || !link || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'add');
    params.append('service', service.toString());
    params.append('link', link);
    params.append('quantity', quantity.toString());

    const response = await axios.post(SMM_API_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'SMM-Panel-Client/1.0'
      },
      timeout: 15000
    });

    if (response.data && response.data.error) {
      console.error("SMM Provider error (Order):", response.data.error);
      return res.status(400).json({ error: response.data.error });
    }

    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("SMM API Error (Order):", error.response.status, error.response.data);
      res.status(error.response.status).json({ 
        error: `SMM Provider Error (${error.response.status})`, 
        details: error.response.data,
        message: typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)
      });
    } else {
      console.error("SMM API Error (Order):", error.message);
      res.status(500).json({ error: "Failed to place order with SMM provider" });
    }
  }
});

app.get("/api/status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'status');
    params.append('order', id);

    const response = await axios.post(SMM_API_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'SMM-Panel-Client/1.0'
      },
      timeout: 15000
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("SMM API Error (Status):", error.response.status, error.response.data);
      res.status(error.response.status).json({ 
        error: "SMM Provider Error", 
        details: error.response.data 
      });
    } else {
      console.error("SMM API Error (Status):", error.message);
      res.status(500).json({ error: "Failed to fetch order status" });
    }
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile("dist/index.html", { root: "." });
  });
}

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
