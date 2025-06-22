import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, accountType } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !accountType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate account type
    if (!['user', 'company', 'recruiter'].includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      );
    }

    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('user', 'company', 'recruiter')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await sql`
      INSERT INTO users (first_name, last_name, email, password_hash, account_type)
      VALUES (${firstName}, ${lastName}, ${email}, ${passwordHash}, ${accountType})
      RETURNING id, first_name, last_name, email, account_type, created_at
    `;

    const newUser = result[0];

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        accountType: newUser.account_type,
        createdAt: newUser.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
