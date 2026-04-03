"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveRepertoireAction(data: {
  title: string;
  color: "white" | "black";
  chapters: { title: string; pgn: string }[];
  repertoireId?: string | null;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to save repertoires." };
  }

  try {
    let repertoire;

    if (data.repertoireId) {
      // Update existing
      repertoire = await prisma.repertoire.update({
        where: { id: data.repertoireId, userId: session.user.id },
        data: {
          title: data.title,
          color: data.color,
        }
      });
      
      // For simplicity in this version, we'll clear and recreate nodes
      // In a production app, we'd do a more complex diffing logic
      await prisma.repertoireNode.deleteMany({
        where: { repertoireId: repertoire.id }
      });
    } else {
      // Create new
      repertoire = await prisma.repertoire.create({
        data: {
          userId: session.user.id,
          title: data.title,
          color: data.color,
        }
      });
    }

    // Save chapters as Nodes
    // Each chapter's PGN is saved as a root node for now (simplified tree)
    for (const chapter of data.chapters) {
      await prisma.repertoireNode.create({
        data: {
          repertoireId: repertoire.id,
          fen: "start",
          pgnMove: chapter.title, // Using title as the move name for top level nodes
          moveNumber: 0,
          comments: chapter.pgn, // Storing full PGN in comments for retrieval
          status: "learning",
        }
      });
    }

    revalidatePath("/dashboard");
    return { success: true, repertoireId: repertoire.id };
  } catch (error) {
    console.error("Save repertoire error:", error);
    return { error: "Failed to save repertoire." };
  }
}
