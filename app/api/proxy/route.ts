// pages/api/proxy.js or app/api/proxy/route.js
import axios from 'axios';

export default async function handler(req: { method: any; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) {
  try {
    const response = await axios({
      method: req.method,
      url: `https://limpiar-backend.onrender.com/api/auth/register`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as any;
    res.status(err.response?.status || 500).json(err.response?.data || {});
  }
}