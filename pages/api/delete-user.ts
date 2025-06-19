
 // Delete userProfile ----------------------------------------------------------------   
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be set in your .env file
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}