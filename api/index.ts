import app from "../server";

export default async function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Handler Error:", error);
    res.status(500).json({ error: "Vercel Handler Error", message: error.message });
  }
}
