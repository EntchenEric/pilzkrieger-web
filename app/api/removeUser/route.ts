import { prisma } from "../../lib/db";
import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

export const POST = async (request: Request) => {
    const data = await request.json()

    if(!data.id || data.id === ""){
        return NextResponse.json({ status: 400, error: 'ID is required' });
    }

    const user = await prisma.user.delete({
        where: {
            id: data.id
        }
    })

    return NextResponse.json({ status: 200, data: user });

};