import { prisma } from "../../lib/db";
import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

export const POST = async (request: Request) => {
    const data = await request.json()

    if (!data.id || data.id === "") {
        return NextResponse.json({ status: 400, error: 'ID is required' });
    }

    console.log(data)

    if (data.nameChange && data.nameChange !== "") {
        const oldName = await prisma.user.findUnique({
            where: {
                id: data.id
            }
        }).then((user) => {
            if (!user) return ""
            return user.name
        })
        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                name: data.nameChange
            }
        })

        await prisma.nameHistory.create({
            data: {
                name: oldName,
                userId: data.id
            }
        })
    }

    if (data.donations) {
        const oldDonations = await prisma.user.findUnique({
            where: {
                id: data.id
            }
        }).then((user) => {
            if (!user) return 0
            return user.donations
        })

        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                donations: data.donations + oldDonations
            }
        })
    }

    if (data.fishParticipation) {
        const oldFishParticipation = await prisma.user.findUnique({
            where: {
                id: data.id
            }
        }).then((user) => {
            if (!user) return 0
            return user.fish
        })

        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                fish: data.fishParticipation + oldFishParticipation
            }
        })
    }

    if (data.lane) {
        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                lane: data.lane
            }
        })
    }

    return NextResponse.json({ status: 200 });

};