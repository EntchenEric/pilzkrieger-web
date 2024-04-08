import { prisma } from "../../lib/db";
import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

export const POST = async (request: Request) => {
    const data = await request.json()

    if(!data.name || data.name === "" || !data.id || data.id === ""){
        return NextResponse.json({ status: 400, error: 'Name is required' });
    }

    const user = await prisma.user.create({
        data: {
            name: data.name,
            id: data.id,
            lane: "TOP",
        }
    })

    return NextResponse.json({ status: 200, data: user });

};