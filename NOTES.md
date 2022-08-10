# Building a react app

This document will detail my process.

## Installing a Node Version Manager

The first step was to install a Node Version Manager, so that we can use node package manager to set up our project. This is going to be different for every operating system.

https://github.com/coreybutler/nvm-windows

1. Navigate to https://github.com/coreybutler/nvm-windows/releases
2. Download the latest nvm-setup.exe
3. Run the installer
4. Run a powershell or cmd as administrator
5. Run the command `nvm install latest`
6. Wait...
7. Run the command `nvm use x.x.x` (with the x's being replaced with the version that just installed)

## Installing React and creating our project folder

1. Create your project folder if you havent already. In my case, I have created the folder c:\n20\
2. Navigate to your desired project folder in PowerShell
3. Run the command `create-react-app nameofproject` Ex. `create-react-app racebook-react`
4. Wait...

## Installing dependancies

I know for a fact I will be trying to use Supabase.

1. From a heightened powershell in your react project root folder, run `npm install @supabase/supabase-js`

## Setting up Supabase

Supabase is a free and open source version of Firebase. I will be attempting to use this to start my project.

1. Navigate to https://app.supabase.com/ and create an account or sign in with github
2. Create a new project

From this point forward I will be roughly following this guide

https://supabase.com/docs/guides/with-react

1. Open the SQL Editor and paste:



    -- Create a table for public "profiles"
    create table profiles (
    id uuid references auth.users not null,
    updated_at timestamp with time zone,
    username text unique,
    avatar_url text,
    website text,

    primary key (id),
    unique(username),
    constraint username_length check (char_length(username) >= 3)
    );

    alter table profiles enable row level security;

    create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

    create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

    create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

    -- Set up Realtime!
    begin;
    drop publication if exists supabase_realtime;
    create publication supabase_realtime;
    commit;
    alter publication supabase_realtime add table profiles;

    -- Set up Storage!
    insert into storage.buckets (id, name)
    values ('avatars', 'avatars');

    create policy "Avatar images are publicly accessible."
    on storage.objects for select
    using ( bucket_id = 'avatars' );

    create policy "Anyone can upload an avatar."
    on storage.objects for insert
  with check ( bucket_id = 'avatars' );

2. Create a file named ".env" in the root of the react project
3. Add the code
    REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
    REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
4. Created a file src/supabaseClient.js and pasted 
    import { createClient } from '@supabase/supabase-js'

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

    export const supabase = createClient(supabaseUrl, supabaseAnonKey)
5. Created a file src/Auth.js
    import { useState } from 'react'
    import { supabase } from './supabaseClient'

    export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
        setLoading(true)
        const { error } = await supabase.auth.signIn({ email })
        if (error) throw error
        alert('Check your email for the login link!')
        } catch (error) {
        alert(error.error_description || error.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="row flex flex-center">
        <div className="col-6 form-widget" aria-live="polite">
            <h1 className="header">Supabase + React</h1>
            <p className="description">Sign in via magic link with your email below</p>
            {loading ? (
            'Sending magic link...'
            ) : (
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input
                id="email"
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button className="button block" aria-live="polite">
                Send magic link
                </button>
            </form>
            )}
        </div>
        </div>
        )
    }


