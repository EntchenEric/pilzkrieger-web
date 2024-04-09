import { prisma } from "../../lib/db";
import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

export const POST = async (request: Request) => {
    const users = await prisma.user.findMany({ include: {nameHistories: true} })

    users.sort((a, b) => {
        // Convert names to lowercase to ensure case-insensitive sorting
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        // Compare the names
        if (nameA < nameB) {
            return -1; // If nameA comes before nameB, return -1
        }
        if (nameA > nameB) {
            return 1; // If nameA comes after nameB, return 1
        }
        return 0; // If names are equal, return 0
    });


    return NextResponse.json({ status: 200, data: users });

};