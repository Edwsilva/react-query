import {NextResponse} from "next/server";
import fs from "fs/promises";
import path from "path";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Define the User type
export interface User {
  id: string;
  fullName: string;
  email: string;
}

// Helper function to ensure users file exists and get its path
async function getUsersFilePath() {
  const filePath = path.join(process.cwd(), "data", "users.json");

  try {
    await fs.access(path.dirname(filePath));
  } catch {
    // Create the data directory if it doesn't exist
    await fs.mkdir(path.dirname(filePath), {recursive: true});
  }

  try {
    await fs.access(filePath);
  } catch {
    // Create empty users file if it doesn't exist
    await fs.writeFile(filePath, JSON.stringify([]));
  }

  return filePath;
}

// GET endpoint to fetch all users
export async function GET() {
  try {
    const filePath = await getUsersFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const users: User[] = JSON.parse(fileContent);

    await delay(1000);

    // return NextResponse.json({error: "Forçando erro"}, {status: 500});

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
  }
}

// POST endpoint to create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {fullName, email} = body;

    if (!fullName || !email) {
      return NextResponse.json(
        {error: "Full name and email are required"},
        {status: 400}
      );
    }

    const filePath = await getUsersFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const users: User[] = JSON.parse(fileContent);

    // Create new user with unique ID
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName,
      email,
    };

    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    await delay(1000);

    return NextResponse.json(newUser, {status: 201});
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({error: "Failed to create user"}, {status: 500});
  }
}
