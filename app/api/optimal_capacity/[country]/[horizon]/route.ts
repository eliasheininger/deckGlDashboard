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
  { params }: { params: { country: string; horizon: string } },
) {
  const { country, horizon } = params;

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM public.optimal_capacity
        WHERE country_code = $1 AND horizon = $2;
      `,
      [country, horizon],
    );

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching optimal capacity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch optimal capacity data" },
      { status: 500 },
    );
  }
}
