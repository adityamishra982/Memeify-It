import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { template_id, text0, text1 } = body;

    const params = new URLSearchParams({
      template_id,
      username: process.env.IMGFLIP_USERNAME || '',
      password: process.env.IMGFLIP_PASSWORD || '',
      text0,
      text1,
    });

    const imgflipRes = await fetch(`https://api.imgflip.com/caption_image`, {
      method: 'POST',
      body: params,
    });

    const data = await imgflipRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Meme generation failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
