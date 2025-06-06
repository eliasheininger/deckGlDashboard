import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { country: string } },
) {
  const country = params.country;

  try {
    const result = await pool.query(
      `
        SELECT "Line", "length", "s_nom", "country_code"
        FROM public.lines
        WHERE country_code = $1;
      `,
      [country],
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
