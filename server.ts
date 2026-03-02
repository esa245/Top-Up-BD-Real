import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SMM_API_KEY = (process.env.SMM_API_KEY || "dc906d24e90ac3cd272586ea2a3d3b30").trim();
const SMM_API_URL = (process.env.SMM_API_URL || "https://motherpanel.com/api/v2").trim();

// API routes
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("SMM API Error (Services):", error.response.status, error.response.data);
      res.status(error.response.status).json({ 
        error: "SMM Provider Error", 
        details: error.response.data,
        status: error.response.status 
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.error("SMM API Error (Order):", error.response.status, error.response.data);
      res.status(error.response.status).json({ 
        error: "SMM Provider Error", 
        details: error.response.data 
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
