# Supabase Setup Guide

Follow these steps to set up your Supabase database for the **Simple Ticket Booking System**:

## 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project**.
3. Choose a project name (e.g. `simple-ticket-booking`) and set a strong database password.

## 2. Execute SQL Schema
1. In your Supabase Dashboard, open the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy all contents from [`supabase/schema.sql`](./schema.sql) and paste them into the SQL editor.
4. Click **Run**.

## 3. Retrieve Credentials
1. Go to **Project Settings** -> **API**.
2. Copy your **Project URL** (`SUPABASE_URL`) and **anon public key** (`SUPABASE_ANON_KEY`).
3. Go to **Project Settings** -> **Database** to view your PostgreSQL connection string:
   ```properties
   DATABASE_URL=jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

## 4. Environment Setup
Copy `.env.example` to `.env` and fill in your credentials:
```properties
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
DATABASE_URL=jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[YOUR-DATABASE-PASSWORD]
```
