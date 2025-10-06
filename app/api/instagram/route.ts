import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v23.0/${process.env.INSTAGRAM_USER_ID}/media`,
      {
        params: {
          fields: "id,media_url,permalink,caption,media_type,thumbnail_url",
          access_token: process.env.INSTAGRAM_TOKEN, // token só no backend
        },
      }
    );

    return NextResponse.json({ photos: data.data });
  } catch (err: any) {
    console.error("Erro Instagram API:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Erro ao buscar Instagram" },
      { status: 500 }
    );
  }
}
