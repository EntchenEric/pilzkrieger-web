import { NextResponse } from "next/server";

export const GET = async (request: Request) => {

    return NextResponse.json({ status: 200, data: "success" });

};