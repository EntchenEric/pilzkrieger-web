import { prisma } from "../../lib/db";
import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

export const GET = async (request: Request) => {
    const users = await prisma.user.findMany()

    return NextResponse.json({ status: 200, data: users });

};