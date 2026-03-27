import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? "Connected" : "Missing";
  const gemini = process.env.GEMINI_API_KEY ? "Connected" : "Missing";

  return NextResponse.json({
    supabase,
    gemini
  });
}
